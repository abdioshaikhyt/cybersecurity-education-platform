from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class SanitizedPolicy(models.Model):
    policy_id = models.IntegerField(primary_key=True)
    policy_name = models.CharField(max_length=200, unique=True)
    sanitized_policy_html = models.TextField(null=True)

class PolicyTrustScore(models.Model):
    policy_id = models.OneToOneField(SanitizedPolicy, on_delete=models.CASCADE, primary_key=True)
    total_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    average_trust_score = models.DecimalField(max_digits=10, decimal_places=3, default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])
    #average_trust_score = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])
    
    def update_trust_score(self, new_score):
        # increment total_count & calulate new trust_score
        if new_score < 0.0 or new_score > 10.0:
            raise ValidationError("new score must be between 0 and 10")
        self.average_trust_score = ((self.average_trust_score * self.total_count) + new_score) / (self.total_count + 1)
        self.total_count += 1
        self.save()

class Category(models.Model):
    category = models.CharField(max_length=100, primary_key=True)
    category_description = models.CharField(max_length=5000, null=True)

class Annotation(models.Model):
    annotation_id = models.IntegerField(primary_key=True)
    policy = models.ForeignKey(SanitizedPolicy, on_delete=models.CASCADE, null=True)
    #category = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    segment = models.IntegerField(null=True)
    startId = models.IntegerField(null=True)
    endId = models.IntegerField(null=True)
    text = models.CharField(max_length=5000, null=True)
    #attributes = models.CharField(max_length=5000, null=True)
    url = models.CharField(max_length=100)
    pretty_print = models.CharField(max_length=5000, default='', blank=True)

    class Meta:
        unique_together = ('policy', 'category', 'segment', 'startId', 'endId')
