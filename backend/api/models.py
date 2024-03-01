from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import User
import re

# Custom validator function for "Month YYYY" format
def validate_batch_format(value):
    if not value or not re.match(r'^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$', value):
        raise ValidationError('Invalid batch format. Please use the following format: Month YYYY')



# Student Model
class Student(models.Model):
    rollNumber = models.CharField(max_length=255, primary_key=True) 
    name = models.CharField(max_length=255)
    emailId = models.EmailField(max_length=255, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')])
    department = models.CharField(max_length=255, choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')])
    joiningDate = models.DateField()
    batch = models.CharField(max_length=225, help_text="Use the following format: Month YYYY", validators=[validate_batch_format])
    educationalQualification = models.CharField(max_length=255, null=True, blank=True)
    region = models.CharField(max_length=255, null=True, blank=True, choices=[('Delhi','Delhi'), ('Outside Delhi','Outside Delhi')])
    admissionThrough = models.CharField(max_length=255, choices=[('Regular','Regular'),('Rolling','Rolling'),('Sponsored','Sponsored'),('Migrated','Migrated'),('Direct','Direct')])
    fundingType = models.CharField(max_length=255, choices=[('Institute', 'Institute'), ('Sponsored', 'Sponsored'), ('Others', 'Others')])
    sourceOfFunding = models.CharField(max_length=255, null=True, blank=True)
    contingencyPoints = models.PositiveIntegerField(default=20000)
    studentStatus = models.CharField(max_length=255, default='Active', choices=[('Terminated','Terminated'), ('Graduated','Graduated'), ('Shifted','Shifted'), ('Semester Leave','Semester Leave'), ('Active','Active')])
    thesisSubmissionDate = models.DateField(blank=True, null=True)
    thesisDefenceDate = models.DateField(blank=True, null=True)
    yearOfLeaving = models.PositiveIntegerField(help_text="Use the following format: YYYY", null=True, blank=True, validators=[MinValueValidator(2000)])
    comment = models.TextField(blank=True, null=True)

    class Meta:
        # Defined an index on the 'emailId' field
        indexes = [
            models.Index(fields=['emailId'])
        ]

    def __str__(self):
        return f"RollNo. {self.rollNumber}"

# Instructor Model
class Instructor(models.Model):
    emailId = models.EmailField(max_length=255, primary_key=True)
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)

    def __str__(self):
        return f"Name: {self.name} Department: {self.department}"
    
# Advisor Model
class Advisor(models.Model):
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, null=True, blank=True, related_name="student_set")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="advisor_set")
    advisorType = models.CharField(max_length=255, choices=[('Advisor-1', 'Advisor-1'), ('Advisor-2', 'Advisor-2'), ('Co-Advisor', 'Co-Advisor')])

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} Instructor: {self.instructor} Advisor Type: {self.advisorType}"
    
# Yearly Review Model
class YearlyReview(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='yearly_reviews') # The related_name attribute is set to 'yearly_reviews', allowing you to access the associated reviews for a student using the attribute yearly_reviews on a Student instance.
    dateOfReview = models.DateField()
    reviewYear = models.PositiveIntegerField(help_text="Enter the review year as a number (e.g., 1, 2, 3, etc.)")
    comment = models.TextField(blank=True, null=True)
    yearlyReviewreviewFile = models.FileField(upload_to="yearly_review_files/", max_length=255, validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} Review Year: {self.reviewYear} Date: {self.dateOfReview}"

# Comprehensive Model
class Comprehensive(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='comprehensive_review')
    dateOfReview = models.DateField()
    comment = models.TextField(blank=True, null=True)
    comprehensiveReviewFile = models.FileField(upload_to="comprehensive_review_files/", max_length=255, validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} Date: {self.dateOfReview}"
    
# Finance Model
class Finance(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="finance_details")
    stipendMonths = models.PositiveIntegerField(default=0)
    contingencyYears = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} StipendMonths: {self.stipendMonths} ContingencyYears: {self.contingencyYears}"
