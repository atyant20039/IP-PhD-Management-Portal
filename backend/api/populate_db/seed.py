from ..models import *
from faker import Faker
import random

fake = Faker()

def seed_all():
    seed_student(150)
    seed_instr(50)
    seed_advisor(1,49)

def seed_student(n):
    for i in range(0, n):
        Student.objects.create(
            rollNumber = "PhD20000" + str(i),
            name = fake.name(),
            emailId = random.choices([fake.first_name(), fake.last_name()])[0] + str(random.randint(0,1000000)) + "@iiitd.ac.in",
            gender = random.choices(['Male','Female'])[0],
            department = random.choices(['CSE','CB', 'ECE', 'SSH', 'MATHS', 'HCD'])[0],
            region = random.choices(['Delhi','Outside Delhi'])[0],
            admissionThrough = random.choices(['Regular', 'Rolling', 'Sponsored', 'Direct', 'Migrated'])[0],
            educationalQualification = fake.text(),
            comment = fake.text(),
            fundingType = random.choices(['Institute', 'Sponsored', 'Others'])[0],
            studentStatus = random.choices(['Active', 'Terminated', 'Graduated', 'Shifted', 'Semester Leave'])[0],
            sourceOfFunding = fake.text(),
            contingencyPoints = random.randint(0,20000),
            yearOfLeaving = fake.pyint(min_value=2000),
            joiningDate = fake.date_between(start_date='-4y', end_date='-3y'),
            thesisSubmissionDate = fake.date_between(start_date='-2y', end_date='-1y'),
            thesisDefenceDate = fake.date_between(start_date='-1y', end_date='today'),
            batch = random.choices(['January','February','March','April','May','June','July','August','September','October','November','December'])[0] + " " + str(random.randint(2000, 2100))
        )

def seed_instr(n):
    for i in range(0, n):
        Instructor.objects.create(
            emailId = random.choices([fake.first_name(), fake.last_name()])[0] + str(random.randint(0,1000000)) + "@iiitd.ac.in",
            name = fake.name(),
            department = random.choices(['CSE','CB', 'ECE', 'SSH', 'MATHS', 'HCD'])[0]
        )

def seed_advisor(a = 0, b = 10):
    for i in range(a, b):
        Advisor.objects.create(
            student_id=i+1,
            advisor1_id=random.randint(a, b),
            advisor2_id=random.randint(a, b),
            coadvisor_id=random.randint(a, b)
        )