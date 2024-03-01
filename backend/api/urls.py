from django.urls import path
from . import views

urlpatterns = [
    path('advisor/<int:pk>', views.advisor_by_id_requests, name="Single Advisor Requests"),
    path('advisor/', views.advisors_requests, name="All Advisors Requests"),
    path('instructor/', views.instructors_requests, name="All Instructors Requests"),
    path('instructor/<str:pk>', views.instructor_by_id_requests, name="Single Instructor Requests"),
    path('student/<str:pk>', views.student_by_id_requests, name="Single Student Requests"),
    path('student/', views.students_requests, name="All Students Requests"),
    path('studentTable/', views.misc_student, name="Miscellaneous Student APIs"),
]