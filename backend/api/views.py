from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.parsers import FileUploadParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F
from .models import *
from .serializers import *

class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'rollNumber'
    lookup_url_kwarg = 'rollNumber'
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name', 'rollNumber', 'studentStatus', 'fundingType', 'gender', 'department', 'region', 'batch', 'admissionThrough']
    search_fields = ['$name', '$emailId', '$rollNumber']

class StudentTableViewSet(ReadOnlyModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentTableSerializer
    parser_classes = [FileUploadParser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name', 'rollNumber', 'studentStatus', 'gender', 'department', 'batch', 'admissionThrough']
    search_fields = ['$name', '$emailId', '$rollNumber', '$advisor_set__instructor__name']
 
    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.annotate(advisor1=F('advisor_set__instructor__name'))
        return queryset.values(
            'name', 'rollNumber', 'emailId', 'gender', 'department', 'batch',
            'admissionThrough', 'advisor1', 'studentStatus', 'contingencyPoints'
        )

class InstructorViewSet(ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

class AdvisorViewSet(ModelViewSet):
    queryset = Advisor.objects.all()
    serializer_class = AdvisorSerializer