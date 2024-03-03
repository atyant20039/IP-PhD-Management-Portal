from django.db import models
from django.core.validators import MinValueValidator,FileExtensionValidator
from .validators import StudentValidator

class Student(models.Model):
    rollNumber = models.CharField(max_length=10, unique=True, validators = [StudentValidator.rollNo]) 
    name = models.CharField(max_length=255)
    emailId = models.EmailField(max_length=255, unique=True, validators = [StudentValidator.email])
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')])
    department = models.CharField(max_length=10, choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')])
    joiningDate = models.DateField()
    batch = models.CharField(max_length=20, help_text="Use the following format: Month YYYY", validators=[StudentValidator.batch])
    educationalQualification = models.CharField(max_length=255, null=True, blank=True)
    region = models.CharField(max_length=15, null=True, blank=True, choices=[('Delhi','Delhi'), ('Outside Delhi','Outside Delhi')])
    admissionThrough = models.CharField(max_length=10, choices=[('Regular','Regular'),('Rolling','Rolling'),('Sponsored','Sponsored'),('Migrated','Migrated'),('Direct','Direct')])
    fundingType = models.CharField(max_length=10, choices=[('Institute', 'Institute'), ('Sponsored', 'Sponsored'), ('Others', 'Others')])
    sourceOfFunding = models.CharField(max_length=255, null=True, blank=True)
    contingencyPoints = models.PositiveIntegerField(default=20000)
    studentStatus = models.CharField(max_length=15, default='Active', choices=[('Active','Active'), ('Terminated','Terminated'), ('Graduated','Graduated'), ('Shifted','Shifted'), ('Semester Leave','Semester Leave')])
    thesisSubmissionDate = models.DateField(blank=True, null=True)
    thesisDefenceDate = models.DateField(blank=True, null=True)
    yearOfLeaving = models.PositiveIntegerField(help_text="Use the following format: YYYY", null=True, blank=True, validators=[MinValueValidator(2000)])
    comment = models.TextField(blank=True, null=True)

    class Meta:
        ordering=['rollNumber']

    def __str__(self):
        return f"RollNo. {self.rollNumber}"
    
class Instructor(models.Model):
    emailId = models.EmailField(max_length=255, unique=True, validators = [StudentValidator.email])
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=10, choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')])

    def __str__(self):
        return f"Name: {self.name} Department: {self.department}"
    
class Advisor(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="advisor_set")
    advisor1 = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_set1")
    advisor2 = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_set2")
    coadvisor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_set3")

    class Meta:
        ordering=['student']

class Comprehensive(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='comprehensive_review')
    dateOfReview = models.DateField()
    comment = models.TextField(blank=True, null=True)
    comprehensiveReviewFile = models.FileField(upload_to="comprehensive_review_files/", max_length=255, validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} Date: {self.dateOfReview}"
    
class Finance(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="finance_details")
    stipendMonths = models.PositiveIntegerField(default=0)
    contingencyYears = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} StipendMonths: {self.stipendMonths} ContingencyYears: {self.contingencyYears}"

class YearlyReview(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='yearly_reviews') # The related_name attribute is set to 'yearly_reviews', allowing you to access the associated reviews for a student using the attribute yearly_reviews on a Student instance.
    dateOfReview = models.DateField()
    reviewYear = models.PositiveIntegerField(help_text="Enter the review year as a number (e.g., 1, 2, 3, etc.)")
    comment = models.TextField(blank=True, null=True)
    yearlyReviewreviewFile = models.FileField(upload_to="yearly_review_files/", max_length=255, validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} Review Year: {self.reviewYear} Date: {self.dateOfReview}"
