from datetime import date

from django.core.exceptions import ValidationError
from rest_framework.exceptions import NotFound
from rest_framework.serializers import (DateField, DecimalField, EmailField,
                                        ModelSerializer,
                                        PrimaryKeyRelatedField,
                                        StringRelatedField)

from . import validator
from .models import *


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

    def validate(self, data):
        jd = data.get('joiningDate')
        tsd = data.get('thesisSubmissionDate')
        tdd = data.get('thesisDefenceDate')
        yol = data.get('yearOfLeaving')
        tddy = None if tdd is None else tdd.year
        validator.dateSequence(jd, tsd, tdd, tddy, yol)
        return super().validate(data)

class InstructorSerializer(ModelSerializer):
    class Meta:
        model = Instructor 
        fields = '__all__'
    
class AdvisorSerializer(ModelSerializer):
    class Meta:
        model = Advisor 
        fields = '__all__'
    
class StudentTableSerializer(ModelSerializer):
    # StringRelatedField is read-only field
    advisor1 = StringRelatedField(source='advisor_set.advisor1')
    advisor2 = StringRelatedField(source='advisor_set.advisor2')
    coadvisor = StringRelatedField(source='advisor_set.coadvisor')

    advisor1_emailId = EmailField(write_only=True, allow_blank=True)
    advisor2_emailId = EmailField(write_only=True, allow_blank=True)
    coadvisor_emailId = EmailField(write_only=True, allow_blank=True)

    class Meta:
        model = Student
        fields = '__all__'

    def create(self, validated_data):
        advisor1_emailId = validated_data.pop('advisor1_emailId', None)
        advisor2_emailId = validated_data.pop('advisor2_emailId', None)
        coadvisor_emailId = validated_data.pop('coadvisor_emailId', None)
        advisor1, advisor2, coadvisor = None, None, None

        student = Student(**validated_data)
        student.full_clean()
        student.save()

        try:
            if (advisor1_emailId):
                advisor1 = None if advisor1_emailId == 'null@iiitd.ac.in' else Instructor.objects.get(emailId=advisor1_emailId)

            if (advisor2_emailId):
                advisor2 = None if advisor2_emailId == 'null@iiitd.ac.in' else Instructor.objects.get(emailId=advisor2_emailId)

            if (coadvisor_emailId):
                coadvisor = None if coadvisor_emailId == 'null@iiitd.ac.in' else Instructor.objects.get(emailId=coadvisor_emailId)
        
        except Instructor.DoesNotExist:
            raise NotFound("No Instructor found with matching Email-Id")

        advisor = Advisor(student = student, advisor1 = advisor1, advisor2 = advisor2, coadvisor = coadvisor)
        advisor.full_clean()
        advisor.save()

        return student
        

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.full_clean()
        instance.save()

        advisor_instance, created = Advisor.objects.get_or_create(student=instance)

        advisor1_emailId = validated_data.pop('advisor1_emailId', None)
        advisor2_emailId = validated_data.pop('advisor2_emailId', None)
        coadvisor_emailId = validated_data.pop('coadvisor_emailId', None)

        try:
            if (advisor1_emailId):
                advisor1 = None if advisor1_emailId == 'null@iiitd.ac.in' else Instructor.objects.get(emailId=advisor1_emailId)
                advisor_instance.advisor1 = advisor1

            if (advisor2_emailId):
                advisor2 = None if advisor2_emailId == 'null@iiitd.ac.in' else Instructor.objects.get(emailId=advisor2_emailId)
                advisor_instance.advisor2 = advisor2

            if (coadvisor_emailId):
                coadvisor = None if coadvisor_emailId == 'null@iiitd.ac.in' else Instructor.objects.get(emailId=coadvisor_emailId)
                advisor_instance.coadvisor = coadvisor
        
        except Instructor.DoesNotExist:
            raise NotFound("No Instructor found with matching Email-Id")

        advisor_instance.full_clean()
        advisor_instance.save()

        return instance

class ComprehensiveSerializer(ModelSerializer):
    class Meta:
        model = Comprehensive
        fields = '__all__'

# class FinanceSerializer(ModelSerializer):
#     class Meta:
#         model = Finance 
#         fields = '__all__'

class YearlyReviewSerializer(ModelSerializer):
    class Meta:
        model = YearlyReview 
        fields = '__all__'

class StipendSerializer(ModelSerializer):
    class Meta:
        model = Stipend 
        fields = '__all__'

class ContingencySerializer(ModelSerializer):
    class Meta:
        model = Contingency 
        fields = '__all__'

class ContingencyLogsSerializer(ModelSerializer):
    student = PrimaryKeyRelatedField(queryset=Student.objects.all())
    openingBalance = DecimalField(max_digits=11, decimal_places=2, read_only=True)
    openingBalanceDate = DateField(format='%d-%m-%Y',read_only=True)
    closingBalance = DecimalField(max_digits=11, decimal_places=2, read_only=True, required=False)
    closingBalanceDate = DateField(format='%d-%m-%Y',read_only=True, required=False)

    class Meta:
        model = ContingencyLogs
        fields = '__all__'

    def validate(self, data):
        """
        Ensure that the santionedAmount is less than or equal to the claimAmount.
        """
        if data['claimAmount'] > data['price']:
            raise ValidationError("Claimed amount cannot be greater than price.")
        
        if data.get('santionedAmount') is not None:
            if data['santionedAmount'] > data['claimAmount']:
                raise ValidationError("Sanctioned amount cannot be greater than claim amount.")
            if data['santionedAmount'] > data['student'].contingencyPoints:
                raise ValidationError("Sanctioned amount cannot be greater than the student's available contingency points.")
        return data

    def create(self, validated_data):
        student = validated_data['student']
        validated_data['openingBalance'] = student.contingencyPoints
        validated_data['openingBalanceDate'] = date.today()
        if 'santionedAmount' in validated_data and validated_data['santionedAmount'] is not None:
            validated_data['closingBalance'] = student.contingencyPoints - validated_data['santionedAmount']
            validated_data['closingBalanceDate'] = date.today()
            student.contingencyPoints -= validated_data['santionedAmount']
            student.save()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        old_santioned_amount = instance.santionedAmount
        new_santioned_amount = validated_data.get('santionedAmount', old_santioned_amount)
        student = instance.student

        if old_santioned_amount is not None and new_santioned_amount != old_santioned_amount:
            difference = new_santioned_amount - old_santioned_amount
            validated_data['closingBalance'] = instance.closingBalance - difference
            student.contingencyPoints -= difference
            student.save()

        if old_santioned_amount is None and new_santioned_amount is not None:
            validated_data['closingBalance'] = student.contingencyPoints - new_santioned_amount
            validated_data['closingBalanceDate'] = date.today()
            student.contingencyPoints -= new_santioned_amount
            student.save()

        return super().update(instance, validated_data)

class ClassroomSerializer(ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'
