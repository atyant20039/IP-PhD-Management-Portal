from ..models import Instructor
from ..serializers import InstructorSerializer
from rest_framework import status
from rest_framework.response import Response


# Create operation
def create_instructor(request):
    if request.method == 'POST':
        serializer = InstructorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Read operation
def get_instructors(request):
    if request.method == 'GET':
        instructors = Instructor.objects.all()
        serializer = InstructorSerializer(instructors, many=True)
        return Response(serializer.data)

def get_instructor_by_id(request, emailId):
    try:
        instructor = Instructor.objects.get(emailId=emailId)
    except Instructor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InstructorSerializer(instructor)
        return Response(serializer.data)

# Update operation
def update_instructor(request, emailId):
    try:
        instructor = Instructor.objects.get(emailId=emailId)
    except Instructor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = InstructorSerializer(instructor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete operation
def delete_instructor(request, emailId):
    try:
        instructor = Instructor.objects.get(emailId=emailId)
    except Instructor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        instructor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
