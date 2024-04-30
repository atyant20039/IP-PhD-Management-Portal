from django.test import TestCase
from datetime import date
from .models import *
from . import validator
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class StudentModelTest(TestCase):
	@classmethod
	def setUpTestData(cls):
		# Set up non-modified objects used by all test methods
		Student.objects.create(rollNumber='PhD12345', name='Test Name', emailId='test@iiitd.ac.in', gender='Male', department='CSE', joiningDate=date.today(), batch='January 2024', admissionThrough='Regular', fundingType='Institute', studentStatus='Active')

	def test_rollNumber_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('rollNumber').verbose_name
		self.assertEquals(field_label, 'rollNumber')

	def test_name_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('name').verbose_name
		self.assertEquals(field_label, 'name')

	def test_emailId_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('emailId').verbose_name
		self.assertEquals(field_label, 'emailId')

	def test_gender_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('gender').verbose_name
		self.assertEquals(field_label, 'gender')
		
	def test_department_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('department').verbose_name
		self.assertEquals(field_label, 'department')
		
	def test_joiningDate_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('joiningDate').verbose_name
		self.assertEquals(field_label, 'joiningDate')
		
	def test_batch_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('batch').verbose_name
		self.assertEquals(field_label, 'batch')
		
	def test_educationalQualification_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('educationalQualification').verbose_name
		self.assertEquals(field_label, 'educationalQualification')
		
	def test_region_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('region').verbose_name
		self.assertEquals(field_label, 'region')
		
	def test_admissionThrough_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('admissionThrough').verbose_name
		self.assertEquals(field_label, 'admissionThrough')
		
	def test_fundingType_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('fundingType').verbose_name
		self.assertEquals(field_label, 'fundingType')
		
	def test_sourceOfFunding_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('sourceOfFunding').verbose_name
		self.assertEquals(field_label, 'sourceOfFunding')
		
	def test_contingencyPoints_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('contingencyPoints').verbose_name
		self.assertEquals(field_label, 'contingencyPoints')
		
	def test_studentStatus_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('studentStatus').verbose_name
		self.assertEquals(field_label, 'studentStatus')
		
	def test_thesisSubmissionDate_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('thesisSubmissionDate').verbose_name
		self.assertEquals(field_label, 'thesisSubmissionDate')
		
	def test_thesisDefenceDate_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('thesisDefenceDate').verbose_name
		self.assertEquals(field_label, 'thesisDefenceDate')
		
	def test_yearOfLeaving_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('yearOfLeaving').verbose_name
		self.assertEquals(field_label, 'yearOfLeaving')
		
	def test_comment_label(self):
		student = Student.objects.get(id=1)
		field_label = student._meta.get_field('comment').verbose_name
		self.assertEquals(field_label, 'comment')

	def test_rollNumber_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('rollNumber').max_length
		self.assertEquals(max_length, 10)

	def test_name_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('name').max_length
		self.assertEquals(max_length, 255)

	def test_emailId_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('emailId').max_length
		self.assertEquals(max_length, 255)

	def test_gender_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('gender').max_length
		self.assertEquals(max_length, 10)

	def test_department_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('department').max_length
		self.assertEquals(max_length, 10)

	def test_batch_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('batch').max_length
		self.assertEquals(max_length, 20)

	def test_educationalQualification_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('educationalQualification').max_length
		self.assertEquals(max_length, 255)

	def test_region_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('region').max_length
		self.assertEquals(max_length, 15)

	def test_admissionThrough_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('admissionThrough').max_length
		self.assertEquals(max_length, 10)

	def test_fundingType_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('fundingType').max_length
		self.assertEquals(max_length, 10)

	def test_sourceOfFunding_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('sourceOfFunding').max_length
		self.assertEquals(max_length, 255)

	def test_studentStatus_max_length(self):
		student = Student.objects.get(id=1)
		max_length = student._meta.get_field('studentStatus').max_length
		self.assertEquals(max_length, 15)

	def test_rollNumber_unique(self):
		student = Student.objects.get(id=1)
		unique = student._meta.get_field('rollNumber').unique
		self.assertTrue(unique)

	def test_emailId_unique(self):
		student = Student.objects.get(id=1)
		unique = student._meta.get_field('emailId').unique
		self.assertTrue(unique)

	def test_rollNumber_validators(self):
		student = Student.objects.get(id=1)
		validators = student._meta.get_field('rollNumber').validators
		self.assertIn(validator.rollNo, validators)

	def test_emailId_validators(self):
		student = Student.objects.get(id=1)
		validators = student._meta.get_field('emailId').validators
		self.assertIn(validator.email, validators)

	def test_batch_validators(self):
		student = Student.objects.get(id=1)
		validators = student._meta.get_field('batch').validators
		self.assertIn(validator.batch, validators)

	def test_contingencyPoints_validators(self):
		student = Student.objects.get(id=1)
		validators = student._meta.get_field('contingencyPoints').validators
		self.assertIn(MinValueValidator(0), validators)

	def test_yearOfLeaving_validators(self):
		student = Student.objects.get(id=1)
		validators = student._meta.get_field('yearOfLeaving').validators
		self.assertIn(MinValueValidator(2000), validators)

	def test_object_name_is_rollNumber(self):
		student = Student.objects.get(id=1)
		expected_object_name = f'RollNo. {student.rollNumber}'
		self.assertEquals(expected_object_name, str(student))

	def test_create_student(self):
		Student.objects.create(rollNumber='PhD12346', name='Test Name 2', emailId='test2@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='February 2024', admissionThrough='Direct', fundingType='Sponsored', studentStatus='Active')
		student = Student.objects.get(rollNumber='PhD12346')
		self.assertEquals(student.name, 'Test Name 2')

	def test_update_student(self):
		student = Student.objects.get(id=1)
		student.name = 'Updated Name'
		student.save()
		self.assertEquals(student.name, 'Updated Name')

	def test_delete_student(self):
		count = Student.objects.count()
		student = Student.objects.get(id=1)
		student.delete()
		self.assertEquals(Student.objects.count(), count - 1)

	# Possible roll number values : [Invalid, PhDadhfa, MTadkja, PhD1234, MT123, MT a db, mt12345, phd12345, Phd12345, pHd12345, phD12345, mT23456, Mt23456, MT123456678910, PhD12345578976, check for unique, abcdefghijklm, MT    , PhD     , MT@12345, "Student.objects.all().delete()"]
""" 
	def test_valid_rollNumber(self):
		try:
			student = Student(rollNumber='PhD10001', name='Test Name 5', emailId='test5@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')
			student.full_clean()
			self.assertEquals(True)

		except:
			self.assertEquals(False)

	def test_invalid_phd_rollNumber(self):
		invalid_phd_roll = ['PhD', 'PhDabcde', 'PhD123', 'PhD0000', 'PhD0000000', 'PhD     ', 'PhD    1']

	def test_invalid_mt_rollNumber(self):
		invalid_mt_roll = ['MT', 'MTabcde', 'MT1234', 'MT0000', 'MT0000000', 'MT     ', 'MT    1']

	def test_invalid_rollNumber(self):
		invalid_roll = ['12345678', 'ABCD1234', '12345678910']

	def test_rollNumber_exception_handling1(self):
		try:
			Student.objects.create(rollNumber='Invalid', name='Test Name 5', emailId='test5@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')

		except ValidationError as e:
			self.assertEquals(str(e), 'Invalid Roll Number format. Please use the following format: PhDxxxxx or MTxxxxx')

		except:
			self.assertEquals(False)

	def test_rollNumber_exception_handling2(self):
		try:
			Student.objects.create(rollNumber='PhDadkbc', name='Test Name 6', emailId='test6@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')
		except ValidationError as e:
			self.assertEquals(str(e), 'Invalid Roll Number format. Please use the following format: PhDxxxxx')

		except:
			self.assertEquals(False)

	def test_rollNumber_exception_handling3(self):
		try:
			Student.objects.create(rollNumber='MTabcde', name='Test Name 7', emailId='test7@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')
		except ValidationError as e:
			self.assertEquals(str(e), 'Invalid Roll Number format. Please use the following format: MTxxxxx')

		except:
			self.assertEquals(False)

	def test_rollNumber_exception_handling4(self):
		try:
			Student.objects.create(rollNumber='PhD1234', name='Test Name 8', emailId='test8@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')
		except ValidationError as e:
			self.assertEquals(str(e), 'Invalid Roll Number format. Please use the following format: PhDxxxxx')

		except:
			self.assertEquals(False)

	def test_rollNumber_exception_handling5(self):
		try:
			student = Student(rollNumber='MT1234', name='Test Name 9', emailId='test9@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')
			# student.full_clean()
		except ValidationError as e:
			print('validation error called')
			self.assertEquals(str(e), 'Invalid Roll Number format. Please use the following format: MTxxxxx')

		except:
			self.assertEquals(False)

	def test_email_exception_handling1(self):
		try:
			Student.objects.create(rollNumber='MT12345', name='Test Name 9', emailId='test9@gmail.com', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')
		except ValidationError as e:
			self.assertEquals(str(e), 'Invalid EmailId format. It should end with "@iiitd.ac.in"')

		except:
			self.assertEquals(False)

	def test_email_exception_handling2(self):
		try:
			Student.objects.create(rollNumber='MT123456', name='Test Name 9', emailId='test9@gmail.com@iiitd.ac.in', gender='Female', department='ECE', joiningDate=date.today(), batch='May 2024', admissionThrough='Direct', fundingType='Institute', studentStatus='Active')
		except ValidationError as e:
			self.assertEquals(str(e), 'Invalid EmailId format. It should end with "@iiitd.ac.in"')

		except:
			self.assertEquals(False)

 """