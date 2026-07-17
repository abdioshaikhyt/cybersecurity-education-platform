from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SanitizedPolicy, PolicyTrustScore, Annotation, Category
from .serializers import SanitizedPolicySerializer, PolicyTrustScoreSerializer, AnnotationSerializer, CategorySerializer
from decimal import Decimal

class SanitizedPolicyViewSet(viewsets.ModelViewSet):
    queryset = SanitizedPolicy.objects.all()
    serializer_class = SanitizedPolicySerializer
    permission_classes = [AllowAny]
    lookup_field = 'policy_id'

class PolicyTrustScoreViewSet(viewsets.ModelViewSet):
    queryset = PolicyTrustScore.objects.all()
    serializer_class = PolicyTrustScoreSerializer
    
    #When user submits trust score
    def create(self, request, *args, **kwargs):
        policy_id = request.data.get('policy_id')
        new_score = Decimal(request.data.get('average_trust_score'))

        # Checking if a trust score for that policy already exists
        policy = SanitizedPolicy.objects.get(policy_id=policy_id)     
        
        PolicyTrustScoreInstance, created = PolicyTrustScore.objects.get_or_create(
            policy_id=policy,
            defaults={'total_count': 1, 'average_trust_score': new_score}
        )
        
        if created:
            # If there was no trust score for that policy, we create one, and return it
            return Response(PolicyTrustScoreSerializer(PolicyTrustScoreInstance).data, status=status.HTTP_201_CREATED)
        else:
            # If there was a trust score for that policy, we update it, and return it
            PolicyTrustScoreInstance.update_trust_score(new_score)
            return Response(PolicyTrustScoreSerializer(PolicyTrustScoreInstance).data, status=status.HTTP_200_OK)
                
class AnnotationViewSet(viewsets.ModelViewSet):
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='policy/(?P<policy_id>[^/.]+)')
    def policy_annotations(self, request, policy_id):
        queryset = self.get_queryset().filter(policy__policy_id=policy_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]