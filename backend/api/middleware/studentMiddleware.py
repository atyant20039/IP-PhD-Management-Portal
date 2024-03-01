from ..models import Student
from ..serializers import StudentSerializer
from ..utils import filterParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.pagination import PageNumberPagination
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.db.models import F, Q
from datetime import datetime

def validateInput(data):
    # Validate rollNumber
    rollNumber = data.get('rollNumber', '')
    if rollNumber:
        if not rollNumber.startswith('PhD') or not rollNumber[3:].isdigit() or len(rollNumber) < 6:
            raise ValidationError('Invalid Roll Number format. Correct format is: PhDxxxxx')

    # Validate emailId
    emailId = data.get('emailId', '')
    if emailId:
        if not emailId.endswith('@iiitd.ac.in') or emailId.count('@') != 1:
            raise ValidationError('Invalid EmailId format. It should end with "@iiitd.ac.in"')

    # Validate charFields with choices
    validate_choice_fields(data, 'gender', ['Male', 'Female', 'Others'])
    validate_choice_fields(data, 'department', ['CSE', 'CB', 'ECE', 'HCD', 'SSH', 'MATHS'])
    validate_choice_fields(data, 'studentStatus', ['Terminated', 'Graduated', 'Shifted', 'Semester Leave', 'Active'])
    validate_choice_fields(data, 'admissionThrough', ['Regular', 'Rolling', 'Sponsored', 'Migrated', 'Direct'])
    validate_choice_fields(data, 'fundingType', ['Institute', 'Sponsored', 'Others'])

    region = data.get('region', '')
    if region:
        validate_choice_fields(data, 'region', ['Delhi', 'Outside Delhi'])

    # Validate contingency Points
    contingencyPoints = data.get('contingencyPoints', None)
    if contingencyPoints is not None and contingencyPoints < 0:
        raise ValidationError('Invalid contingency points. It should be greater than or equal to 0.')

    # Validate thesis submission and defense dates
    validate_date_order(data, 'thesisSubmissionDate', 'joiningDate')
    validate_date_order(data, 'thesisDefenceDate', 'thesisSubmissionDate')

    # Validate year of leaving
    yearOfLeaving = data.get('yearOfLeaving', None)
    thesisDefenceYear = data.get('thesisDefenceDate', {}).get('year', None)

    if yearOfLeaving is not None and yearOfLeaving < 2000:
        raise ValidationError('Invalid Year of Leaving. Minimum valid value is 2000.')
    
    if yearOfLeaving is not None and thesisDefenceYear is not None and yearOfLeaving < thesisDefenceYear:
        raise ValidationError('Invalid Year Of Leaving. It should be equal to or after the Thesis Defence year.')

def validate_choice_fields(data, field_name, choices):
    field_value = data.get(field_name, '')
    if field_value not in [choice[0] for choice in choices]:
        raise ValidationError(f'Invalid {field_name} value. Valid choices are: {", ".join(choices)}.')

def validate_date_order(data, later_date_field, earlier_date_field):
    later_date_str = data.get(later_date_field, '')
    earlier_date_str = data.get(earlier_date_field, '')

    if later_date_str and earlier_date_str:
        later_date = datetime.strptime(later_date_str, '%Y-%m-%d').date()
        earlier_date = datetime.strptime(earlier_date_str, '%Y-%m-%d').date()

        if later_date < earlier_date:
            raise ValidationError(f'Invalid {later_date_field}. It should be after {earlier_date_field}.')

def get_student_by_id(request, rno):
    # Check if the rollNumber is valid
    if not rno.startswith('PhD') or not rno[3:].isdigit() or len(rno) < 6:
        return Response({'error': 'Invalid Roll Number format. Correct format is: PhDxxxxx'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        student = get_object_or_404(Student, rollNumber = rno)
        serializer = StudentSerializer(student, many = False)
        return Response(serializer.data)
    except Http404:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def update_student(request, rno):
    if not rno.startswith('PhD') or not rno[3:].isdigit() or len(rno) < 6:
        return Response({'error':'Invalid Roll Number format. Correct format is: PhDxxxxx'}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    try:
        validateInput(data)

        existing_student = Student.objects.exclude(rollNumber=rno).filter(rollNumber=data.get('rollNumber', ''))
        if existing_student.exists():
            raise ValidationError('Roll Number should be unique. Another student with the same RollNumber already exists.')

        existing_email = Student.objects.exclude(rollNumber=rno).filter(emailId=data.get('emailId', ''))
        if existing_email.exists():
            raise ValidationError('EmailId should be unique. Another student with the same EmailId already exists.')

        student = get_object_or_404(Student, rollNumber = rno)
        serializer = StudentSerializer(instance = student, data = data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def delete_student(request, rno):
    # Check if the rollNumber is valid
    if not rno.startswith('PhD') or not rno[3:].isdigit() or len(rno) < 6:
        return Response({'error': 'Invalid rollNumber format. Correct format is: PhDxxxxx'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        student = get_object_or_404(Student, rollNumber=rno)
        student.delete()
        return Response({'message': 'Student deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Http404:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_students(request):
    try:
        search_query = request.query_params.get('search', '')
        filter_query = request.query_params.get('filter', '')

        students = Student.objects.filter(
            Q(name__icontains=search_query) |  # Search by name
            Q(rollNumber__icontains=search_query) |  # Search by rollNumber
            Q(emailId__icontains=search_query) # Search by emailId
        ).filter(
            **filterParser.parse_filter_query(filter_query, Student)
        )

        '''# Create a paginator
        paginator = PageNumberPagination()
        paginator.page_size = 50  # Set the number of items per page

        # Paginate the queryset
        result_page = paginator.paginate_queryset(students, request)

        # Serialize the paginated students
        serializer = StudentSerializer(result_page, many=True)

        # Return the serialized data along with pagination metadata
        return paginator.get_paginated_response(serializer.data)'''

        serializer = StudentSerializer(students, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except ParseError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def add_students(request):
    try:
        data = request.data
        required_fields = ['rollNumber', 'name', 'emailId', 'gender', 'department', 'joiningDate', 'batch', 'admissionThrough', 'fundingType' ]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

        validateInput(data)

        existing_student_rollNumber = Student.objects.filter(rollNumber=data.get('rollNumber', ''))
        if existing_student_rollNumber.exists():
            raise ValidationError('Roll Number should be unique. Another student with the same Roll Number already exists.')

        existing_student_email = Student.objects.filter(emailId=data.get('emailId', ''))
        if existing_student_email.exists():
            raise ValidationError('EmailId should be unique. Another student with the same EmailId already exists.')

        serializer = StudentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Http404:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_students_table(request):
    try:
        search_query = request.query_params.get('search', '')
        filter_query = request.query_params.get('filter', '')
        
        students = Student.objects.annotate(
            advisor1=F('advisor_set__instructor__name')
        ).filter(
            **filterParser.parse_filter_query(filter_query, Student)
        ).filter(
            Q(name__icontains=search_query) |  # Search by name
            Q(rollNumber__icontains=search_query) |  # Search by rollNumber
            Q(emailId__icontains=search_query) | # Search by emailId
            Q(advisor1___icontains=search_query)  # Search by advisor_name
        ).values(
            'name', 'rollNumber', 'gender', 'department', 'batch',
            'admissionThrough', 'advisor1', 'studentStatus', 'contingencyPoints'
        )

        '''# Create a paginator
        paginator = PageNumberPagination()
        paginator.page_size = 50  # Set the number of items per page

        # Paginate the queryset
        result_page = paginator.paginate_queryset(students, request)

        # Serialize the paginated students
        serializer = StudentSerializer(result_page, many=True)

        # Return the serialized data along with pagination metadata
        return paginator.get_paginated_response(serializer.data)'''

        return Response(students, status=status.HTTP_200_OK)
    
    except ParseError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def add_students_by_file(request):
    pass