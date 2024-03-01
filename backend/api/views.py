from django.shortcuts import render
from .middleware import advisorMiddleware, comprehensiveMiddleware, financeMiddleware, instructorMiddleware, studentMiddleware, yearlyReviewMiddleware
from rest_framework.decorators import api_view

@api_view(['GET', 'PUT', 'DELETE'])
def advisor_by_id_requests(request, pk):
    if request.method == 'GET':
        return advisorMiddleware.get_advisor_by_id(request, pk)
    if request.method == 'PUT':
        return advisorMiddleware.update_advisor(request, pk)
    if request.method == 'DELETE':
        return advisorMiddleware.delete_advisor(request, pk)
    
@api_view(['GET', 'POST'])
def advisors_requests(request):
    if request.method == 'GET':
        return advisorMiddleware.get_advisors(request)
    if request.method == 'POST':
        return advisorMiddleware.create_advisor(request)
    

@api_view(['GET', 'POST'])
def instructors_requests(request):
    if request.method == 'GET':
        return instructorMiddleware.get_instructors(request)
    if request.method == 'POST':
        return instructorMiddleware.create_instructor(request)


@api_view(['GET', 'PUT', 'DELETE'])
def instructor_by_id_requests(request, pk):
    if request.method == 'GET':
        return instructorMiddleware.get_instructor_by_id(request, pk)
    if request.method == 'PUT':
        return instructorMiddleware.update_instructor(request, pk)
    if request.method == 'DELETE':
        return instructorMiddleware.delete_instructor(request, pk)
    
@api_view(['GET', 'PUT', 'DELETE'])
def student_by_id_requests(request, pk):
    if request.method == 'GET':
        return studentMiddleware.get_student_by_id(request, pk)
    if request.method == 'PUT':
        return studentMiddleware.update_student(request, pk)
    if request.method == 'DELETE':
        return studentMiddleware.delete_student(request, pk)
    
@api_view(['GET', 'POST'])
def students_requests(request):
    if request.method == 'GET':
        return studentMiddleware.get_students(request)
    if request.method == 'POST':
        return studentMiddleware.add_students(request)
    
@api_view(['GET', 'POST'])
def misc_student(request):
    if request.method == 'GET':
        return studentMiddleware.get_students_table(request)
    if request.method == 'POST':
        return studentMiddleware.add_students_by_file(request)