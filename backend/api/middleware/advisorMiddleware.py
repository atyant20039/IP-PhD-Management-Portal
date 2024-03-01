from rest_framework import status
from rest_framework.response import Response
from ..models import Advisor
from ..serializers import AdvisorSerializer

# Create operation
def create_advisor(request):
    if request.method == 'POST':
        serializer = AdvisorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Read operation
def get_advisors(request):
    if request.method == 'GET':
        advisors = Advisor.objects.all()
        serializer = AdvisorSerializer(advisors, many=True)
        return Response(serializer.data)

def get_advisor_by_id(request, advisor_id):
    try:
        advisor = Advisor.objects.get(id=advisor_id)
    except Advisor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AdvisorSerializer(advisor)
        return Response(serializer.data)

# Update operation
def update_advisor(request, advisor_id):
    try:
        advisor = Advisor.objects.get(id=advisor_id)
    except Advisor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AdvisorSerializer(advisor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete operation
def delete_advisor(request, advisor_id):
    try:
        advisor = Advisor.objects.get(id=advisor_id)
    except Advisor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        advisor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)