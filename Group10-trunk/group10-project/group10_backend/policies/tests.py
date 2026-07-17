from django.test import TestCase, Client
from .models import SanitizedPolicy, PolicyTrustScore, Annotation, Category
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.urls import reverse

def set_up_test_data():
    #create test object for each model
    test_policy = SanitizedPolicy.objects.create(policy_id = 0, policy_name = 'test policy', sanitized_policy_html = 'test html')
    test_policy_2 = SanitizedPolicy.objects.create(policy_id = 1, policy_name = 'test policy 2', sanitized_policy_html = 'test html')
    test_category = Category.objects.create(category = 'test category', category_description = 'test category description')
    PolicyTrustScore.objects.create(policy_id = test_policy, total_count = 1, average_trust_score = 10.0)
    PolicyTrustScore.objects.create(policy_id = test_policy_2, total_count = 0, average_trust_score = 0.0)
    Annotation.objects.create(annotation_id = 0, policy = test_policy, category = test_category, segment = 0, startId = 0, endId = 20, text = 'test annotation text', url = 'test annotation url', pretty_print = 'test annotation pretty print')

# Create your tests here.
class modelsTestCase(TestCase):
    def setUp(self):
        set_up_test_data()
    
    def test_valid_sanitized_policy(self):
        test_policy = SanitizedPolicy.objects.get(policy_id = 0)
        #check if sanitized policy fetched correctly
        self.assertEqual(test_policy.policy_name, 'test policy')
    
    def test_valid_policy_trust_score(self):
        test_policy = SanitizedPolicy.objects.get(policy_id = 0)
        test_score = PolicyTrustScore.objects.get(policy_id = test_policy)
        #check if trust score is fetched correctly
        self.assertEqual(test_score.total_count, 1)
        self.assertEqual(test_score.average_trust_score, 10.0)
    
    def test_valid_policy_trust_score_update(self):
        test_policy = SanitizedPolicy.objects.get(policy_id = 0)
        test_score = PolicyTrustScore.objects.get(policy_id = test_policy)
        test_score.update_trust_score(8)
        #check if average trust score and total count are updated correctly
        self.assertEqual(test_score.total_count, 2)
        self.assertEqual(test_score.average_trust_score, 9.0)
    
    def test_valid_category(self):
        test_category = Category.objects.get(category = 'test category')
        #check if category fetched correctly
        self.assertEqual(test_category.category_description, 'test category description')

    def test_valid_annotation(self):
        test_annotation = Annotation.objects.get(annotation_id = 0)
        #check if annotation fetched correctly
        self.assertEqual(test_annotation.text, 'test annotation text')
        #check if category is linked to annotation correctly
        self.assertEqual(test_annotation.category.category_description, 'test category description')
        #check if policy is linked to annotation correctly
        self.assertEqual(test_annotation.policy.policy_name, 'test policy')

    def test_invalid_sanitized_policy(self):
        #check if using a non-unique policy name raises an integrity error
        with self.assertRaises(IntegrityError):
            invalid_policy = SanitizedPolicy.objects.create(policy_id = 1, policy_name = 'test policy', sanitized_policy_html = 'test html 2')
            invalid_policy.full_clean()
    
    def test_invalid_policy_trust_score(self):
        test_policy = SanitizedPolicy.objects.get(policy_id = 1)
        #check if using an invalid total_count raises an integrity error
        with self.assertRaises(IntegrityError):
            invalid_test_score = PolicyTrustScore.objects.create(policy_id = test_policy, total_count = -1, average_trust_score = 10.0)
            invalid_test_score.full_clean()
    
    def test_invalid_policy_trust_score_update(self):
        test_policy = SanitizedPolicy.objects.get(policy_id = 1)
        test_score = PolicyTrustScore.objects.get(policy_id = test_policy)

        #check if updating with a new score above 10 raises a validation error
        with self.assertRaises(ValidationError):
            test_score.update_trust_score(100)
        
        #check if updating with a new score below 0 raises a validation error
        with self.assertRaises(ValidationError):
            test_score.update_trust_score(-1)

    def test_invalid_category(self):
        #check if using a non-unique category name raises an integrity error
        with self.assertRaises(IntegrityError):
            invalid_category = Category.objects.create(category = 'test category', category_description = 'test category description 2')
            invalid_category.full_clean()

    def test_invalid_annotation(self):
        original_annotation = Annotation.objects.get(annotation_id = 0)
        
        #check if using a non-unique (policy, category, segment, startId, endId) grouping raises a validation error
        with self.assertRaises(IntegrityError):
            invalid_annotation = Annotation.objects.create(annotation_id = 1, policy = original_annotation.policy, category = original_annotation.category, segment = original_annotation.segment, startId = original_annotation.startId, endId = original_annotation.endId, text = 'test annotation text', url = 'test annotation url', pretty_print = 'test annotation pretty print')
            invalid_annotation.full_clean()

class routesTestCase(TestCase):
    def setUp(self):
        set_up_test_data()
        self.client = Client() #set up mock client

    def test_sanitized_policy_list_route(self):
        response = self.client.get(reverse('sanitizedpolicy-list'))
        self.assertEqual(response.status_code, 200)
    
    def test_valid_sanitized_policy_detail_route(self):
        response = self.client.get(reverse('sanitizedpolicy-detail', args=[0]))
        self.assertEqual(response.status_code, 200)
    
    def test_invalid_sanitized_policy_detail_route(self):
        response = self.client.get(reverse('sanitizedpolicy-detail', args=[2]))
        self.assertEqual(response.status_code, 404)
    
    def test_policy_trust_score_list_route(self):
        response = self.client.get(reverse('trustscore-list'))
        self.assertEqual(response.status_code, 200)
    
    def test_valid_policy_trust_score_detail_route(self):
        response = self.client.get(reverse('trustscore-detail', args=[0]))
        self.assertEqual(response.status_code, 200)
    
    def test_invalid_policy_trust_score_detail_route(self):
        response = self.client.get(reverse('trustscore-detail', args=[2]))
        self.assertEqual(response.status_code, 404)

    def test_category_list_route(self):
        response = self.client.get(reverse('category-list'))
        self.assertEqual(response.status_code, 200)
    
    def test_valid_category_detail_route(self):
        response = self.client.get(reverse('category-detail', args=['test category']))
        self.assertEqual(response.status_code, 200)
    
    def test_invalid_category_detail_route(self):
        response = self.client.get(reverse('category-detail', args=['this category does not exist']))
        self.assertEqual(response.status_code, 404)

    def test_annotation_list_route(self):
        response = self.client.get(reverse('annotation-list'))
        self.assertEqual(response.status_code, 200)
    
    def test_valid_annotation_detail_route(self):
        response = self.client.get(reverse('annotation-detail', args=[0]))
        self.assertEqual(response.status_code, 200)

    def test_valid_annotation_detail_route(self):
        response = self.client.get(reverse('annotation-detail', args=[2]))
        self.assertEqual(response.status_code, 404)