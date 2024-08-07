# Generated by Django 5.0.2 on 2024-05-14 07:47

import api.validator
import datetime
import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Instructor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('emailId', models.EmailField(max_length=255, unique=True, validators=[api.validator.email])),
                ('name', models.CharField(max_length=255)),
                ('department', models.CharField(choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')], max_length=10)),
            ],
            options={
                'ordering': ['emailId'],
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rollNumber', models.CharField(max_length=10, unique=True, validators=[api.validator.rollNo])),
                ('name', models.CharField(max_length=255)),
                ('emailId', models.EmailField(max_length=255, unique=True, validators=[api.validator.email])),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')], max_length=10)),
                ('department', models.CharField(choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')], max_length=10)),
                ('joiningDate', models.DateField()),
                ('batch', models.CharField(help_text='Use the following format: Month YYYY', max_length=20, validators=[api.validator.batch])),
                ('educationalQualification', models.CharField(blank=True, max_length=255, null=True)),
                ('region', models.CharField(blank=True, choices=[('Delhi', 'Delhi'), ('Outside Delhi', 'Outside Delhi')], max_length=15, null=True)),
                ('admissionThrough', models.CharField(choices=[('Regular', 'Regular'), ('Rolling', 'Rolling'), ('Sponsored', 'Sponsored'), ('Migrated', 'Migrated'), ('Direct', 'Direct')], max_length=10)),
                ('fundingType', models.CharField(choices=[('Institute', 'Institute'), ('Sponsored', 'Sponsored'), ('Others', 'Others')], max_length=10)),
                ('sourceOfFunding', models.CharField(blank=True, max_length=255, null=True)),
                ('contingencyPoints', models.DecimalField(decimal_places=2, default=20000, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('stipendMonths', models.PositiveIntegerField(default=60)),
                ('contingencyYears', models.PositiveIntegerField(default=5)),
                ('studentStatus', models.CharField(choices=[('Active', 'Active'), ('Terminated', 'Terminated'), ('Graduated', 'Graduated'), ('Shifted', 'Shifted'), ('Semester Leave', 'Semester Leave')], default='Active', max_length=15)),
                ('thesisSubmissionDate', models.DateField(blank=True, null=True)),
                ('thesisDefenceDate', models.DateField(blank=True, null=True)),
                ('yearOfLeaving', models.PositiveIntegerField(blank=True, help_text='Use the following format: YYYY', null=True, validators=[django.core.validators.MinValueValidator(2000)])),
                ('comment', models.TextField(blank=True, null=True)),
            ],
            options={
                'ordering': ['rollNumber'],
            },
        ),
        migrations.CreateModel(
            name='ContingencyLogs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item', models.TextField()),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('price', models.DecimalField(decimal_places=2, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('source', models.TextField()),
                ('credit', models.TextField()),
                ('claimAmount', models.DecimalField(decimal_places=2, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('santionedAmount', models.DecimalField(blank=True, decimal_places=2, max_digits=11, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('forwardedBy', models.CharField(blank=True, max_length=255, null=True)),
                ('forwardedOnDate', models.DateField(blank=True, null=True)),
                ('openingBalance', models.DecimalField(decimal_places=2, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('closingBalance', models.DecimalField(blank=True, decimal_places=2, max_digits=11, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('openingBalanceDate', models.DateField(auto_now_add=True)),
                ('closingBalanceDate', models.DateField(blank=True, null=True)),
                ('comment', models.TextField(blank=True, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contingencyLogs', to='api.student')),
            ],
            options={
                'ordering': ['student'],
            },
        ),
        migrations.CreateModel(
            name='Comprehensive',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dateOfReview', models.DateField(default=datetime.date.today)),
                ('comment', models.TextField(blank=True, null=True)),
                ('comprehensiveReviewFile', models.FileField(max_length=255, upload_to='comprehensive_review_files/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])),
                ('student', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='comprehensive_review', to='api.student')),
            ],
            options={
                'ordering': ['student'],
            },
        ),
        migrations.CreateModel(
            name='Advisor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('advisor1', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='student_set1', to='api.instructor')),
                ('advisor2', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='student_set2', to='api.instructor')),
                ('coadvisor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='student_set3', to='api.instructor')),
                ('student', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='advisor_set', to='api.student')),
            ],
            options={
                'ordering': ['student'],
            },
        ),
        migrations.CreateModel(
            name='Stipend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('disbursmentDate', models.DateField(default=datetime.date.today)),
                ('month', models.IntegerField(default=5)),
                ('year', models.IntegerField(default=2024)),
                ('hostler', models.CharField(choices=[('YES', 'YES'), ('NO', 'NO')], default='YES', max_length=10)),
                ('baseAmount', models.DecimalField(decimal_places=2, default=37000, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('hra', models.DecimalField(decimal_places=2, default=0, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('comment', models.TextField(blank=True, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stipend', to='api.student')),
            ],
            options={
                'ordering': ['student'],
                'unique_together': {('student', 'month', 'year')},
            },
        ),
        migrations.CreateModel(
            name='Contingency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('disbursmentDate', models.DateField(default=datetime.date.today)),
                ('year', models.IntegerField(default=2024)),
                ('amount', models.DecimalField(decimal_places=2, default=15000, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('comment', models.TextField(blank=True, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contingency', to='api.student')),
            ],
            options={
                'ordering': ['student'],
                'unique_together': {('student', 'year')},
            },
        ),
        migrations.CreateModel(
            name='YearlyReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dateOfReview', models.DateField(default=datetime.date.today)),
                ('reviewYear', models.PositiveIntegerField(help_text='Enter the review year as a number (e.g., 1, 2, 3, etc.)')),
                ('comment', models.TextField(blank=True, null=True)),
                ('yearlyReviewFile', models.FileField(max_length=255, upload_to='yearly_review_files/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='yearly_reviews', to='api.student')),
            ],
            options={
                'ordering': ['student'],
                'unique_together': {('student', 'reviewYear')},
            },
        ),
    ]
