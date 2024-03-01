from rest_framework.serializers import ModelSerializer
from .models import Student, Comprehensive, Finance, Instructor, Advisor, YearlyReview

class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

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