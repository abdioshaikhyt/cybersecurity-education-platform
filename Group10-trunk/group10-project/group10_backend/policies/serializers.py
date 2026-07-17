from rest_framework import serializers
from rest_framework.relations import HyperlinkedRelatedField
from .models import SanitizedPolicy, PolicyTrustScore, Annotation, Category

class SanitizedPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = SanitizedPolicy
        fields = ['policy_id', 'policy_name', 'sanitized_policy_html']
        read_only_fields = fields

class PolicyTrustScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyTrustScore
        fields = ['policy_id', 'average_trust_score', 'total_count']

class AnnotationSerializer(serializers.ModelSerializer):
    policy = HyperlinkedRelatedField(view_name='sanitizedpolicy-detail', lookup_field='policy_id', read_only=True)
    
    class Meta:
        model = Annotation
        fields = ['annotation_id', 'policy', 'category', 'segment', 'startId', 'endId', 'text', 'url', 'pretty_print']
        read_only_fields = fields

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category', 'category_description']
        read_only_fields = fields