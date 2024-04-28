import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from openpyxl import Workbook, load_workbook
from openpyxl.worksheet.cell_range import CellRange
from openpyxl.worksheet.datavalidation import DataValidation
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

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

class StudentTableViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentTableSerializer
    lookup_field = 'rollNumber'
    lookup_url_kwarg = 'rollNumber'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name', 'emailId', 'rollNumber', 'studentStatus', 'gender', 'department', 'batch', 'admissionThrough', 'region', 'fundingType', 'yearOfLeaving']
    search_fields = ['$name', '$emailId', '$rollNumber', '$advisor_set__advisor1__name', '$advisor_set__advisor2__name', '$advisor_set__coadvisor__name']

class StudentImportViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):
    serializer_class = StudentTableSerializer
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        if self.action == 'list':
            return Student.objects.none()
        else:
            return Student.objects.all()
        
    def list(self, request, *args, **kwargs):
        file_path = os.path.join(settings.BASE_DIR, 'templates', 'StudentTemplate.xlsx')
        wb = load_workbook(file_path)
        ws = wb.active

        if not "InstructorList" in wb.sheetnames:
            names_sheet = wb.create_sheet(title="InstructorList")
        else:
            names_sheet = wb["InstructorList"]

        names_sheet['C1'].value = "DO NOT EDIT THIS SHEET"
        names_sheet.sheet_state = 'hidden'

        instructors = list(Instructor.objects.order_by('name').values_list('name', 'emailId'))

        for index, instructor in enumerate(instructors, start=1):
            names_sheet[f'A{index}'].value = instructor[0]
            names_sheet[f'B{index}'].value = instructor[1]

        dv_range = f'InstructorList!$A$1:$A${len(instructors)}'

        dv = DataValidation(type="list", formula1=f'={dv_range}', allow_blank=True, showErrorMessage=True)

        dv.errorTitle = 'Invalid Option'
        dv.error = 'This is not a valid option'

        cell_range = CellRange(min_col=9, min_row=2, max_col=11, max_row=1048576)
        dv.add(cell_range)

        ws.add_data_validation(dv)

        wb.save(file_path)

        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename="StudentTemplate.xlsx"'
            return response

    def camel_case(self, header):
        return header[0].lower() + header.replace('*','').replace(' ','')[1:]

    def get_advisor_email(self, name, instructor_list):
        for row in instructor_list.iter_rows(min_row=1, values_only=True):
            if name == row[0]:
                return row[1]
        return None

    def create(self, request, *args,**kwargs):
        if 'file' not in request.data:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.data['file']

        if not uploaded_file.name.endswith('.xlsx'):
            return Response({'error': 'Invalid file format. Please upload an Excel file (.xlsx)'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            workbook = load_workbook(uploaded_file)
            sheet = workbook.active

            instructorList = workbook["InstructorList"]

            sheet_headers = [cell.value for cell in sheet[1]]
            required_columns = [
                'Roll Number*',
                'Name*',
                'Email Id*',
                'Gender*', 
                'Department*',
                'Joining Date*',
                'Batch Month*',
                'Batch Year*',
                'Advisor 1',
                'Advisor 2',
                'Coadvisor',
                'Educational Qualification',
                'Region',
                'Admission Through*',
                'Funding Type*',
                'Source Of Funding',
                'Contingency Points*',
                'Student Status*',
                'Thesis Submission Date',
                'Thesis Defence Date',
                'Year Of Leaving',
                'Comment'
            ]
            
            if not all(col in sheet_headers for col in required_columns):
                return Response({'error': 'Missing required columns in the Excel file'}, status=status.HTTP_400_BAD_REQUEST)

            invalid_rows = []
            processed_headers = [self.camel_case(header) for header in sheet_headers]

            for row in sheet.iter_rows(min_row=2, values_only=True):
                if all(cell is None for cell in row):
                    continue

                row_data = dict(zip(processed_headers, row))
                if not all(row_data.get(self.camel_case(header)) for header in required_columns if '*' in header):
                    invalid_rows.append({'student': row_data, 'error': 'Missing required data'})
                    continue

                row_data['batch'] = f"{row_data.pop('batchMonth')} {row_data.pop('batchYear')}"
            
                for advisor_key in ['advisor1', 'advisor2', 'coadvisor']:
                    name = row_data.get(advisor_key)
                    if name:
                        email = self.get_advisor_email(name, instructorList)
                        if email:
                            row_data[f'{advisor_key}_emailId'] = email
                        else:
                            invalid_rows.append({'student': row_data, 'error': f'{advisor_key}: {name} not found in Faculty List'})
                            continue
                    else:
                        row_data[f'{advisor_key}_emailId'] = 'null@iiitd.ac.in'

                for date_key in ['joiningDate', 'thesisSubmissionDate', 'thesisDefenceDate']:
                    if row_data[date_key] is not None:
                        row_data[date_key] = row_data[date_key].strftime('%d-%m-%Y')

                serializer = StudentTableSerializer(data=row_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    invalid_rows.append({'student': row_data, 'error': serializer.errors})

            if not invalid_rows:
                return Response({'message': 'Students successfully added'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Failed adding some students', 'invalid_data': invalid_rows}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': f'Error processing the Excel file: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentExportViewSet(ListModelMixin, GenericViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentTableSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name', 'emailId', 'rollNumber', 'studentStatus', 'gender', 'department', 'batch', 'admissionThrough', 'region', 'fundingType', 'yearOfLeaving']
    search_fields = ['$name', '$emailId', '$rollNumber', '$advisor_set__advisor1__name', '$advisor_set__advisor2__name', '$advisor_set__coadvisor__name']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        wb = Workbook()
        ws = wb.active
        ws.title = "Students"

        headers = ['Roll Number', 'Name', 'Email ID', 'Gender', 'Department', 'Advisor 1', 'Advisor 2', 'Coadvisor', 'Joining Date', 'Batch', 'Educational Qualification', 'Region', 'Admission Through', 'Funding Type', 'Source of Funding', 'Contingency Points', 'Student Status', 'Thesis Submission Date', 'Thesis Defence Date', 'Year of Leaving', 'Comment']
        ws.append(headers)

        for student in serializer.data:
            data = [
                student.get('rollNumber', ''),
                student.get('name', ''),
                student.get('emailId', ''),
                student.get('gender', ''),
                student.get('department', ''),
                student.get('advisor1', ''),
                student.get('advisor2', ''),
                student.get('coadvisor', ''),
                student.get('joiningDate', ''),
                student.get('batch', ''),
                student.get('educationalQualification', ''),
                student.get('region', ''),
                student.get('admissionThrough', ''),
                student.get('fundingType', ''),
                student.get('sourceOfFunding', ''),
                student.get('contingencyPoints', ''),
                student.get('studentStatus', ''),
                student.get('thesisSubmissionDate', ''),
                student.get('thesisDefenceDate', ''),
                student.get('yearOfLeaving', ''),
                student.get('comment', '')
            ]
            ws.append(data)

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=students_data.xlsx'
        wb.save(response)

        return response

class InstructorViewSet(ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['emailId','name', 'department']
    search_fields = ['$emailId', '$name']

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