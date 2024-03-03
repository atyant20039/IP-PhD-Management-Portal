import pandas as pd
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, GenericViewSet
from rest_framework.mixins import CreateModelMixin
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
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
    filterset_fields = ['name', 'emailId', 'rollNumber', 'studentStatus', 'fundingType', 'gender', 'department', 'region', 'batch', 'admissionThrough']
    search_fields = ['$name', '$emailId', '$rollNumber']

class StudentTableViewSet(ReadOnlyModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentTableSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name', 'emailId', 'rollNumber', 'studentStatus', 'gender', 'department', 'batch', 'admissionThrough']
    search_fields = ['$name', '$emailId', '$rollNumber', '$advisor_set__instructor__name']
 
    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.annotate(advisor1=F('advisor_set__advisor1__name'))
        return queryset.values(
            'name', 'rollNumber', 'emailId', 'gender', 'department', 'batch',
            'admissionThrough', 'advisor1', 'studentStatus', 'contingencyPoints'
        )

class StudentImportViewSet(CreateModelMixin, GenericViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    parser_classes = [MultiPartParser]

    def create(self, request, *args,**kwargs):
        if 'file' not in request.data:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.data['file']

        if not uploaded_file.name.endswith('.xlsx'):
            return Response({'error': 'Invalid file format. Please upload an Excel file (.xlsx)'}, status=status.HTTP_400_BAD_REQUEST)

        column_data_types = {
            'rollNumber': str,
            'name': str,
            'emailId': str,
            'gender': str,
            'department': str,
            'joiningDate': 'datetime64[ns]',
            'batch': str,
            'educationalQualification': str,
            'region': str,
            'admissionThrough': str,
            'fundingType': str,
            'sourceOfFunding': str,
            'contingencyPoints': int,
            'studentStatus': str,
            'thesisSubmissionDate': 'datetime64[ns]',
            'thesisDefenceDate': 'datetime64[ns]',
            'yearOfLeaving': pd.Int64Dtype(),
            'comment': str,
        }

        try:
            df = pd.read_excel(uploaded_file, dtype=column_data_types)
            
            required_columns = ['rollNumber', 'name', 'emailId', 'gender', 'department', 'joiningDate', 'batch', 'admissionThrough', 'fundingType', 'contingencyPoints', 'studentStatus', 'region', 'educationalQualification', 'sourceOfFunding', 'thesisSubmissionDate', 'thesisDefenceDate', 'yearOfLeaving', 'comment']
            if not all(col in df.columns for col in required_columns):
                return Response({'error': 'Missing required columns in the Excel file'}, status=status.HTTP_400_BAD_REQUEST)
            
            invalid_rows = []

            for row in df.itertuples(index=False):
                data_dict = row._asdict()
                data_dict['joiningDate'] = pd.to_datetime(data_dict['joiningDate'], errors='coerce')

                if 'thesisSubmissionDate' in data_dict and pd.notnull(data_dict['thesisSubmissionDate']):
                    data_dict['thesisSubmissionDate'] = pd.to_datetime(data_dict['thesisSubmissionDate'], errors='coerce')

                if 'thesisDefenceDate' in data_dict and pd.notnull(data_dict['thesisDefenceDate']):
                    data_dict['thesisDefenceDate'] = pd.to_datetime(data_dict['thesisDefenceDate'], errors='coerce')

                data_dict['joiningDate'] = data_dict['joiningDate'].strftime('%Y-%m-%d')
                data_dict['thesisSubmissionDate'] = data_dict.get('thesisSubmissionDate', None).strftime('%Y-%m-%d') if 'thesisSubmissionDate' in data_dict and pd.notnull(data_dict['thesisSubmissionDate']) else None
                data_dict['thesisDefenceDate'] = data_dict.get('thesisDefenceDate', None).strftime('%Y-%m-%d') if 'thesisDefenceDate' in data_dict and pd.notnull(data_dict['thesisDefenceDate']) else None
                data_dict = {key: value if not pd.isna(value) else None for key, value in data_dict.items()}
                
                serializer = StudentSerializer(data=data_dict)
                if serializer.is_valid():
                    serializer.save()
                else:
                    invalid_rows.append({'student': data_dict, 'error': serializer.errors})

            if not invalid_rows:
                return Response({'message': 'Data successfully imported'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Failed importing mentioned students', 'invalid_data': invalid_rows}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': f'Error processing the Excel file: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InstructorViewSet(ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['emailId','name', 'department']
    search_fields = ['$emailId', '$name']

class AdvisorViewSet(ModelViewSet):
    queryset = Advisor.objects.all()
    serializer_class = AdvisorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student', 'advisor1', 'advisor2', 'coadvisor']