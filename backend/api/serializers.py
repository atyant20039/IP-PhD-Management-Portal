from rest_framework.serializers import ModelSerializer, CharField
from .models import *
from . import validator

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
    
class StudentTableSerializer(ModelSerializer):
    advisor1 = CharField()
    class Meta:
        model = Student
        fields = ['id', 'name', 'rollNumber', 'emailId', 'gender', 'department', 'batch', 'admissionThrough', 'studentStatus', 'contingencyPoints', 'advisor1']

class ComprehensiveSerializer(ModelSerializer):
    class Meta:
        model = Comprehensive
        fields = '__all__'

class FinanceSerializer(ModelSerializer):
    class Meta:
        model = Finance 
        fields = '__all__'

class InstructorSerializer(ModelSerializer):
    class Meta:
        model = Instructor 
        fields = '__all__'

class AdvisorSerializer(ModelSerializer):
    class Meta:
        model = Advisor 
        fields = '__all__'

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
        model = ContingencyLogs 
        fields = '__all__'
