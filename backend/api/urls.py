from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('student', StudentViewSet, basename='student')
router.register('instructor', InstructorViewSet, basename='instructor')
router.register('advisor', AdvisorViewSet, basename='advisor')
router.register('studentTable', StudentTableViewSet, basename='studentTable')
router.register('studentFile', StudentImportViewSet, basename='studentFile')
router.register('comprehensive', ComprehensiveViewSet, basename='comprehensive')
router.register('yearlyReview', YearlyReviewViewSet, basename='yearlyReview')
router.register('finance', FinanceViewSet, basename='finance')
router.register('stipend', StipendViewSet, basename='stipend')
router.register('contingency', ContingencyViewSet, basename='contingency')
router.register('classroom', ClassroomViewSet, basename='classroom')
# router.register('allotment', AllotmentViewSet, basename='allotment')


urlpatterns = []
urlpatterns += router.urls