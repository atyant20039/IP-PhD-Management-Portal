from datetime import date

from django.core.validators import FileExtensionValidator, MinValueValidator
from django.db import models

from . import validator


class Student(models.Model):
    rollNumber = models.CharField(max_length=10, unique=True, validators = [validator.rollNo]) 
    name = models.CharField(max_length=255)
    emailId = models.EmailField(max_length=255, unique=True, validators = [validator.email])
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')])
    department = models.CharField(max_length=10, choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')])
    joiningDate = models.DateField()
    batch = models.CharField(max_length=20, help_text="Use the following format: Month YYYY", validators=[validator.batch])
    educationalQualification = models.CharField(max_length=255, null=True, blank=True)
    region = models.CharField(max_length=15, null=True, blank=True, choices=[('Delhi','Delhi'), ('Outside Delhi','Outside Delhi')])
    admissionThrough = models.CharField(max_length=10, choices=[('Regular','Regular'),('Rolling','Rolling'),('Sponsored','Sponsored'),('Migrated','Migrated'),('Direct','Direct')])
    fundingType = models.CharField(max_length=10, choices=[('Institute', 'Institute'), ('Sponsored', 'Sponsored'), ('Others', 'Others')])
    sourceOfFunding = models.CharField(max_length=255, null=True, blank=True)
    contingencyPoints = models.DecimalField(decimal_places=2, max_digits = 11, default=20000, validators = [MinValueValidator(0)])
    stipendMonths = models.PositiveIntegerField(default=60)
    contingencyYears = models.PositiveIntegerField(default=5)
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
    emailId = models.EmailField(max_length=255, unique=True, validators = [validator.email])
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=10, choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')])

    class Meta:
        ordering=['emailId']

    def __str__(self):
        return f"{self.name}"
    
class Advisor(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="advisor_set")
    advisor1 = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_set1")
    advisor2 = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_set2")
    coadvisor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_set3")

    class Meta:
        ordering=['student']

class Comprehensive(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='comprehensive_review')
    dateOfReview = models.DateField(default = date.today)
    comment = models.TextField(blank=True, null=True)
    comprehensiveReviewFile = models.FileField(upload_to="comprehensive_review_files/", max_length=255,validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])

    class Meta:
        ordering=['student']

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} Date: {self.dateOfReview}"
    
# class Finance(models.Model):
#     student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="finance_details")
#     stipendMonths = models.PositiveIntegerField(default=0)
#     contingencyYears = models.PositiveIntegerField(default=0)

#     class Meta:
#         ordering=['student']

#     def __str__(self):
#         return f"RollNo: {self.student.rollNumber} StipendMonths: {self.stipendMonths} ContingencyYears: {self.contingencyYears}"

class YearlyReview(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='yearly_reviews')
    dateOfReview = models.DateField(default = date.today)
    reviewYear = models.PositiveIntegerField(help_text="Enter the review year as a number (e.g., 1, 2, 3, etc.)")
    comment = models.TextField(blank=True, null=True)
    yearlyReviewreviewFile = models.FileField(upload_to="yearly_review_files/", max_length=255, validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])

    def __str__(self):
        return f"RollNo: {self.student.rollNumber} Review Year: {self.reviewYear} Date: {self.dateOfReview}"

    class Meta:
        unique_together = ('student', 'reviewYear')
        ordering=['student']

class Stipend(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='stipend')
    disbursmentDate = models.DateField(default = date.today)
    month = models.IntegerField(default=date.today().month)
    year = models.IntegerField(default=date.today().year)
    hostler = models.CharField(max_length=10, choices=[('YES', 'YES'), ('NO', 'NO')], default="YES")
    comment = models.TextField(null=True, blank=True)
    baseAmount = models.DecimalField(max_digits=11, decimal_places=2, default=37000, validators=[MinValueValidator(0)])
    hra = models.DecimalField(max_digits=11, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    comment = models.TextField(null=True, blank=True)

    class Meta:
        ordering=['student']
        unique_together = ['student', 'month', 'year']


class ContingencyLogs(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='contingency')
    item = models.TextField()
    quantity = models.PositiveIntegerField(default = 1)
    price = models.DecimalField(max_digits=11, decimal_places=2, validators=[MinValueValidator(0)])
    source = models.TextField()
    credit = models.TextField()
    # TODO: Confirm from PhD admin that no loans are given to student ie. contingency points never go below 0
    claimAmount = models.DecimalField(max_digits=11, decimal_places=2, validators=[MinValueValidator(0)])
    santionedAmount = models.DecimalField(blank = True, null = True, max_digits=11, decimal_places=2, validators=[MinValueValidator(0)])
    forwardedBy = models.CharField(max_length=255, blank = True, null = True)
    forwardedOnDate = models.DateField(blank = True, null = True)
    openingBalance = models.DecimalField(max_digits=11, decimal_places=2, validators=[MinValueValidator(0)])
    closingBalance = models.DecimalField(blank = True, null = True, max_digits=11, decimal_places=2, validators=[MinValueValidator(0)])
    openingBalanceDate = models.DateField(auto_now_add=True)
    closingBalanceDate = models.DateField(blank = True, null = True)
    comment = models.TextField(blank = True, null = True)

    class Meta:
        ordering=['student']