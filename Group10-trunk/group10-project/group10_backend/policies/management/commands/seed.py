import csv
import os
import json
import re
from django.core.management.base import BaseCommand
from policies.models import Annotation, SanitizedPolicy, Category  # replace with your actual app name
from django.conf import settings

duplicate_annotations = {} #(policy, category, segmentId, startId, endId) : [annotation_id_1, annotation_id_2, ...]

class Command(BaseCommand):
    help = 'Seeds the sanitized policies, annotations, and pretty prints from CSV and HTML files'

    def handle(self, *args, **kwargs):
        # Define the paths for the sanitized_policies, annotations, and pretty_print folders
        sanitized_policies_folder = os.path.join(settings.BASE_DIR, 'opp-115-dataset', 'sanitized_policies')
        annotations_folder = os.path.join(settings.BASE_DIR, 'opp-115-dataset', 'annotations')
        pretty_print_folder = os.path.join(settings.BASE_DIR, 'opp-115-dataset', 'pretty_print')
        categories = os.path.join(settings.BASE_DIR, 'opp-115-dataset', 'categories_explained.csv')
        
        if not os.path.exists(categories):
            self.stdout.write(self.style.ERROR(f"{categories} not found"))
            return
        
        self.seed_categories_from_csv(categories)

        # Check if the sanitized_policies folder exists
        if not os.path.exists(sanitized_policies_folder):
            self.stdout.write(self.style.ERROR(f"Sanitized Policies folder not found: {sanitized_policies_folder}"))
            return

        # Loop through each HTML file in the sanitized_policies folder and seed the SanitizedPolicy model
        for filename in os.listdir(sanitized_policies_folder):
            if filename.endswith('.html'):
                html_path = os.path.join(sanitized_policies_folder, filename)
                self.seed_sanitized_policy_from_html(html_path)

        # Check if the annotations folder exists
        if not os.path.exists(annotations_folder):
            self.stdout.write(self.style.ERROR(f"Annotations folder not found: {annotations_folder}"))
            return

        # Loop through each CSV file in the annotations folder and seed the Annotation model
        for filename in os.listdir(annotations_folder):
            if filename.endswith('.csv'):
                csv_path = os.path.join(annotations_folder, filename)
                policy_id = self.extract_policy_id_from_filename(filename)
                self.seed_annotations_from_csv(csv_path, policy_id)

        # Check if the pretty_print folder exists
        if not os.path.exists(pretty_print_folder):
            self.stdout.write(self.style.ERROR(f"Pretty Print folder not found: {pretty_print_folder}"))
            return

        # Loop through each CSV file in the pretty_print folder and seed the PrettyPrint model
        for filename in os.listdir(pretty_print_folder):
            if filename.endswith('.csv'):
                csv_path = os.path.join(pretty_print_folder, filename)
                self.seed_pretty_print_from_csv(csv_path)

        self.stdout.write(self.style.SUCCESS('Successfully seeded sanitized policies, annotations, and pretty prints'))

    def extract_policy_id_from_filename(self, filename):
        # Use regex to extract the numeric prefix from the filename (e.g., '123_policy_name.html' -> 123)
        match = re.match(r"^(\d+)_", filename)
        if match:
            return int(match.group(1))  # Return the policy ID as an integer
        else:
            self.stdout.write(self.style.ERROR(f"Could not extract policy ID from filename: {filename}"))
            return None
    
    def extract_policy_name_from_filename(self, filename):
        # Use regex to extract the policy name from the filename (e.g., '123_policy_name.html' -> 'policy_name')
        match = re.match(r"^\d+_(.+)\.html$", filename)
        if match:
            return match.group(1)  # Return the policy name
        else:
            self.stdout.write(self.style.ERROR(f"Could not extract policy name from filename: {filename}"))
            return None

    def seed_sanitized_policy_from_html(self, html_path):
        """
        Seeds SanitizedPolicy data from the given HTML file.
        The HTML file name contains the policy_id and its content is stored in sanitized_policy.
        """
        # Extract the policy_id from the file name
        filename = os.path.basename(html_path)
        policy_id = self.extract_policy_id_from_filename(filename)
        policy_name = self.extract_policy_name_from_filename(filename)

        if not policy_id:
            self.stdout.write(self.style.ERROR(f"Skipping file with invalid filename: {filename}"))
            return

        # Read the contents of the HTML file
        with open(html_path, 'r', encoding='utf-8-sig') as file:
            sanitized_policy_content = file.read()

        # Create or update the sanitized policy entry in the database
        sanitized_policy_entry, created = SanitizedPolicy.objects.update_or_create(
            policy_id=policy_id,
            policy_name=policy_name,
            defaults={'sanitized_policy_html': sanitized_policy_content}
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created sanitized policy for policy_id {policy_id}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Updated sanitized policy for policy_id {policy_id}"))

    def seed_annotations_from_csv(self, csv_path, policy_id):
        """
        Seeds Annotation data from the given CSV file.
        The CSV file contains the annotation data including attributes that should be parsed from JSON.
        """
        with open(csv_path, mode='r', encoding='utf-8-sig', errors="replace") as file:
            reader = csv.reader(file, delimiter=',')
            header = next(reader)  # Skip header row

            # Loop through each row in the CSV file
            for row in reader:
                annotation_id = row[0]
                '''batch_id = row[1]
                annotator_id = row[2]'''
                segment_id = row[4]
                category = row[5]
                attributes = row[6]  # This is the JSON string
                #date = row[7]
                url = row[8]

                # Parse the attributes (JSON string) into a Python dictionary
                attributes_dict = json.loads(attributes) if attributes else {}

                # Extract the start and end index and selected text
                start_id, end_id, text = self.extract_text_and_indices(attributes_dict)

                # If no valid text was found (i.e., startId and endId are -1), skip this entry
                if start_id == -1 or end_id == -1:
                    continue

                #if selected text already annotated with the same category skip this entry
                #but also record the duplicate for pretty print matching later
                if (policy_id, category, segment_id, start_id, end_id) in duplicate_annotations.keys():
                    duplicate_annotations[(policy_id, category, segment_id, start_id, end_id)].append(annotation_id)
                    continue
                else:
                    duplicate_annotations[(policy_id, category, segment_id, start_id, end_id)] = [annotation_id]

                # Look up the corresponding sanitized policy by policy_id
                try:
                    sanitized_policy = SanitizedPolicy.objects.get(policy_id=policy_id)
                except SanitizedPolicy.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"SanitizedPolicy with policy_id {policy_id} does not exist"))
                    continue

                # Create or update the annotation in the database and link it to the sanitized_policy
                annotation, created = Annotation.objects.update_or_create(
                    annotation_id=annotation_id,
                    defaults={
                        'policy': sanitized_policy,  # Set the foreign key to the sanitized policy
                        'category': Category.objects.get(category=category),
                        'segment': segment_id,
                        'startId': start_id,
                        'endId': end_id,
                        'text': text,
                        'url': url
                    }
                )

                '''if created:
                    self.stdout.write(self.style.SUCCESS(f"Created annotation {annotation_id} with policy_id {policy_id}"))
                else:
                    self.stdout.write(self.style.SUCCESS(f"Updated annotation {annotation_id} with policy_id {policy_id}"))'''
                
            self.stdout.write(self.style.SUCCESS(f"Created annotations for policy_id {policy_id}"))

    def extract_text_and_indices(self, attributes_dict):
        """
        Extract the startIndexInSegment, endIndexInSegment, and selectedText from the attributes dictionary.
        If either index is -1, it will return (-1, -1, '').
        """
        best_start_id = -1
        best_end_id = -1
        best_text = ''

        for key, value in attributes_dict.items():
            if isinstance(value, dict):
                start_id = value.get("startIndexInSegment", -1)
                end_id = value.get("endIndexInSegment", -1)
                text = value.get("selectedText", '')
                if end_id-start_id > best_end_id-best_start_id:
                    best_end_id = end_id
                    best_start_id = start_id
                    best_text = text

                '''# If startId or endId is -1, skip this entry
                if start_id == -1 or end_id == -1:
                    return -1, -1, ''  # Skip this entry'''

        return best_start_id, best_end_id, best_text

    def seed_pretty_print_from_csv(self, csv_path):
        """
        Seeds PrettyPrint data from the given CSV file.
        The CSV file contains annotation_id and pretty_print fields.

        Note: normal that some entries will not be created, since some annotations are skipped if they have invalid contents.
        """
        with open(csv_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.reader(file, delimiter=',')
            header = next(reader)  # Skip header row

            # Loop through each row in the CSV file
            for row in reader:
                annotation_id = row[0]
                pretty_print = row[3]  # Pretty print text is the 4th column (index 3)

                '''# Look up the Annotation by annotation_id
                try:
                    annotation = Annotation.objects.get(annotation_id=annotation_id)
                except Annotation.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"Annotation with annotation_id {annotation_id} does not exist"))
                    continue

                # Create a PrettyPrint entry and link it to the Annotation
                pretty_print_entry, created = PrettyPrint.objects.update_or_create(
                    annotation=annotation,
                    defaults={'pretty_print': pretty_print}
                )'''

                for key in duplicate_annotations:
                    duplicate_set = duplicate_annotations[key]
                    if annotation_id in duplicate_set:
                        # Look up the Annotation by annotation_id
                        try:
                            annotation = Annotation.objects.get(annotation_id=duplicate_set[0])
                            annotation.pretty_print += pretty_print + '\n'
                            annotation.save()
                            #self.stdout.write(self.style.SUCCESS(f"Updated PrettyPrint for annotation_id {duplicate_set[0]}"))
                            break
                        except Annotation.DoesNotExist:
                            self.stdout.write(self.style.ERROR(f"Annotation with annotation_id {duplicate_set[0]} does not exist"))
                            break

                '''#add pretty print to annotation entry
                Annotation.objects.filter(annotation_id=annotation_id).update(pretty_print=pretty_print)'''

                '''if created:
                    self.stdout.write(self.style.SUCCESS(f"Created PrettyPrint for annotation_id {annotation_id}"))
                else:
                    self.stdout.write(self.style.SUCCESS(f"Updated PrettyPrint for annotation_id {annotation_id}"))'''
                
            self.stdout.write(self.style.SUCCESS(f"Updated pretty_prints for annotations from {csv_path}"))
    
    def seed_categories_from_csv(self, csv_path):
        file = open(csv_path, 'r')
        reader = csv.reader(file, delimiter=',')

        # Loop through each row in the CSV file
        for row in reader:
            category = row[0]
            description = row[1]

            Category.objects.create(category=category, category_description=description)
            self.stdout.write(self.style.SUCCESS(f"Created category {category}"))
        
        file.close()
