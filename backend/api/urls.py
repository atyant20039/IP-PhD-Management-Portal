from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('student', StudentViewSet, basename='student')
router.register('instructor', InstructorViewSet, basename='instructor')
router.register('advisor', AdvisorViewSet, basename='advisor')
router.register('studentTable', StudentTableViewSet, basename='studentTable')
router.register('studentFile', StudentImportViewSet, basename='studentFile')

urlpatterns = []

urlpatterns += router.urls