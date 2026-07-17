from django.urls import include, path
from rest_framework import routers
from .views import SanitizedPolicyViewSet, PolicyTrustScoreViewSet, AnnotationViewSet, CategoryViewSet

router = routers.DefaultRouter()
router.register(r'trust_score', PolicyTrustScoreViewSet, basename='trustscore')
router.register(r'sanitizedpolicies', SanitizedPolicyViewSet, basename='sanitizedpolicy')
router.register(r'annotations', AnnotationViewSet, basename='annotation')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('policies/', include(router.urls)),
]
