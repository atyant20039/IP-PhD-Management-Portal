import openpyxl
import os
from django.http import HttpResponse
from django.conf import settings
from django.core.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, GenericViewSet, ViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F
from .models import *
from .serializers import *
import subprocess

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
    lookup_field = 'rollNumber'
    lookup_url_kwarg = 'rollNumber'
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name', 'emailId', 'rollNumber', 'studentStatus', 'gender', 'department', 'batch', 'admissionThrough', 'region', 'fundingType', 'yearOfLeaving']
    search_fields = ['$name', '$emailId', '$rollNumber', '$advisor1', '$advisor2', '$coadvisor']
 
    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.annotate(
            advisor1=F('advisor_set__advisor1__name'),
            advisor2=F('advisor_set__advisor2__name'),
            coadvisor=F('advisor_set__coadvisor__name')
            )
        sort_by = self.request.query_params.get('sort')
        if sort_by:
            if sort_by not in self.serializer_class.Meta.fields:
                raise ValidationError('Invalid field for sorting')

            queryset = queryset.order_by(sort_by)
        return queryset

class StudentImportViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):
    serializer_class = StudentSerializer
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        if self.action == 'list':
            return Student.objects.none()
        else:
            return Student.objects.all()

    def list(self, request, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'templates', 'StudentTemplate.xlsm')
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename="StudentTemplate.xlsm"'
            return response

    def create(self, request, *args,**kwargs):
        if 'file' not in request.data:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.data['file']

        if not uploaded_file.name.endswith('.xlsm'):
            return Response({'error': 'Invalid file format. Please upload an Excel-Macro file (.xlsm)'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the list of required columns from the Student model aka all fields
        fields = Student._meta.fields
        required_columns = [field.name for field in fields]
        required_columns.remove('id')

        try:
            workbook = openpyxl.load_workbook(uploaded_file)
            sheet = workbook.active

            data = []
            keys = [cell.value for cell in sheet[1]]
            
            if not all(col in keys for col in required_columns):
                return Response({'error': 'Missing required columns in the Excel file'}, status=status.HTTP_400_BAD_REQUEST)

            for row in sheet.iter_rows(min_row=2, values_only=True):
                if all(cell is None for cell in row):
                    continue
                data.append(dict(zip(keys, row)))
            
            invalid_rows = []
            for row in data:
                row_dict = {}
                for key, value in row.items():
                    row_dict[key] = value
                    if key == 'joiningDate' or key == 'thesisSubmissionDate' or key == 'thesisDefenceDate':
                        if value is not None:
                            row_dict[key] = value.strftime('%Y-%m-%d')

                serializer = StudentSerializer(data=row_dict)
                if serializer.is_valid():
                    serializer.save()
                else:
                    invalid_rows.append({'student': row_dict, 'error': serializer.errors})

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

    def get_queryset(self):
        queryset = super().get_queryset()
        sort_by = self.request.query_params.get('sort')
        if sort_by:
            if sort_by not in [field.name for field in Instructor._meta.get_fields()]:
                raise ValidationError('Invalid field for sorting')

            queryset = queryset.order_by(sort_by)
        return queryset

class AdvisorViewSet(ModelViewSet):
    queryset = Advisor.objects.all()
    serializer_class = AdvisorSerializer
    lookup_field = 'student__rollNumber'
    lookup_url_kwarg = 'student__rollNumber'
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['student', 'advisor1', 'advisor2', 'coadvisor']
    search_fields = ['$student__rollNumber']

class ComprehensiveViewSet(ModelViewSet):
    queryset = Comprehensive.objects.all()
    serializer_class = ComprehensiveSerializer
    filter_backends = [SearchFilter]
    search_fields = ['$student__rollNumber']

class YearlyReviewViewSet(ModelViewSet):
    queryset = YearlyReview.objects.all()
    serializer_class = YearlyReviewSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filter_fields = ['reviewYear']
    search_fields = ['$student__rollNumber']

class FinanceViewSet(ModelViewSet):
    queryset = Finance.objects.all()
    serializer_class = FinanceSerializer
    lookup_field = 'student__rollNumber'
    lookup_url_kwarg = 'student__rollNumber'
    filter_backends = [SearchFilter]
    search_fields = ['$student__rollNumber']

class StipendViewSet(ModelViewSet):
    queryset = Stipend.objects.all()
    serializer_class = StipendSerializer
    lookup_field = 'student__rollNumber'
    lookup_url_kwarg = 'student__rollNumber'
    filter_backends = [SearchFilter]
    search_fields = ['$student__rollNumber']

class ContingencyViewSet(ModelViewSet):
    queryset = ContingencyLogs.objects.all()
    serializer_class = ContingencySerializer
    lookup_field = 'student__rollNumber'
    lookup_url_kwarg = 'student__rollNumber'
    filter_backends = [SearchFilter]
    search_fields = ['$student__rollNumber']

class ClassroomViewSet(ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['building', 'roomNo']
    search_fields = ['$building', '$roomNo']


class StipendViewSet(ModelViewSet):
    
    pass

# class AllotmentViewSet(ViewSet):
#     parser_classes = [MultiPartParser]

#     def create(self, request, format=None): # In the post method of the APIView, the format=None parameter indicates the format in which the response should be returned.
#         os.chdir(os.path.join(settings.BASE_DIR, 'algorithm'))

#         TARatio = request.data.get('TARatio')

#         # # Saving the files to the 'algorithm' directory
#         file_names = {
#         #     'file1': 'StudentRegistration.xlsx',
#         #     'file2': 'StudentList.xlsx',
#             'file3': 'Classroom.xlsx',
#         #     'file4': 'TAList.xlsx',
#         #     'file5': 'ExamDateSheet.xlsx'
#         }

#         for key, file in request.FILES.items():
#             file_name = file_names.get(key)
#             if file_name:
#                 with open(file_name, 'wb+') as destination:
#                     for chunk in file.chunks():
#                         destination.write(chunk)


#         # Validations for Excel Files.


#         # Run the python script
#         subprocess.call(['python', 'AllotInvigilators.py', '--TARatio', TARatio])

#         # # Read the generated file and return it as a response
#         # with open('InvigilatorList.xlsx', 'rb') as f:
#         #     response = HttpResponse(f.read(), content_type='application/octet-stream')
#         #     response['Content-Disposition'] = 'attachment; filename=InvigilatorList.xlsx'

#         # # Delete the files
#         # for file_name in file_names.values():
#         #     os.remove(file_name)
#         # os.remove('InvigilatorList.xlsx')

#         return Response({'message': 'Files uploaded successfully'}, status=status.HTTP_200_OK)