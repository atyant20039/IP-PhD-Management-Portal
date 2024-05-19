from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()
router.register('student', StudentViewSet, basename='student')
router.register('instructor', InstructorViewSet, basename='instructor')
router.register('allInstructors', AllInstructorViewSet, basename='allInstructors')
router.register('advisor', AdvisorViewSet, basename='advisor')
router.register('studentTable', StudentTableViewSet, basename='studentTable')
router.register('studentFile', StudentImportViewSet, basename='studentFile')
router.register('comprehensive', ComprehensiveViewSet, basename='comprehensive')
router.register('yearlyReview', YearlyReviewViewSet, basename='yearlyReview')
# router.register('finance', FinanceViewSet, basename='finance')
router.register('stipend', StipendViewSet, basename='stipend')
router.register('contingency', ContingencyViewSet, basename='contingency')
router.register('contingencyLogs', ContingencyLogsViewSet, basename='contingencyLogs')
router.register('studentDownload', StudentExportViewSet, basename='studentDownload')
router.register('stipendEligible', EligibleStudentStipendViewSet, basename='stipendEligible')
router.register('examDateSheet', ExamDateSheetTemplateViewSet, basename='examDateSheet')
router.register('taList', TATemplateViewSet, basename='taList')
router.register('studentList', StudentListTemplateViewSet, basename='studentList')
router.register('studentRegistrationList', StudentRegistrationTemplateViewSet, basename='studentRegistrationList')
urlpatterns = []
urlpatterns += router.urls