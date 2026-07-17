import os
import csv
import json
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "group10_backend.settings")
django.setup()

from policies.models import Annotation

# Folder containing annotation CSV files (relative to project root)
DATA_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../data/annotations")

def seed_database():
    annotations = []

    for filename in os.listdir(DATA_FOLDER):
        if filename.endswith(".csv"):
            file_path = os.path.join(DATA_FOLDER, filename)
            print(f"Processing {filename}...")

            with open(file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile)
                next(reader)  # Skip header row

                for row in reader:
                    try:
                        annotation_id = int(row[0])  # Annotation ID
                        policy_id = int(row[3])      # Policy ID
                        category = row[5]            # Category
                        attributes = json.loads(row[6])  # Convert JSON string to dict
                        #attributes = row[6]
                        url = row[-1]                # URL

                        annotation = Annotation(
                            annotation_id=annotation_id,
                            policy_id=policy_id,
                            category=category,
                            attributes=attributes,
                            url=url
                        )
                        annotations.append(annotation)

                    except Exception as e:
                        print(f"Skipping row in {filename} due to error: {e}")

    # Bulk insert all annotations at once (optimized for performance)
    if annotations:
        Annotation.objects.bulk_create(annotations, ignore_conflicts=True)
        print(f"Seeded {len(annotations)} annotations.")
    else:
        print("No new annotations to seed.")

if __name__ == "__main__":
    seed_database()
