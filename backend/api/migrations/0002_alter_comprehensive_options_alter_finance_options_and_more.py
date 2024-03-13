# Generated by Django 5.0.2 on 2024-03-12 16:02

import datetime
import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comprehensive',
            options={'ordering': ['student']},
        ),
        migrations.AlterModelOptions(
            name='finance',
            options={'ordering': ['student']},
        ),
        migrations.AlterModelOptions(
            name='instructor',
            options={'ordering': ['emailId']},
        ),
        migrations.AlterModelOptions(
            name='yearlyreview',
            options={'ordering': ['student']},
        ),
        migrations.AlterField(
            model_name='comprehensive',
            name='comprehensiveReviewFile',
            field=models.FileField(max_length=255, upload_to='comprehensive_review_files/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]),
        ),
        migrations.AlterField(
            model_name='comprehensive',
            name='dateOfReview',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='comprehensive',
            name='student',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='comprehensive_review', to='api.student'),
        ),
        migrations.AlterField(
            model_name='student',
            name='contingencyPoints',
            field=models.DecimalField(decimal_places=2, default=20000, max_digits=11, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='yearlyreview',
            name='dateOfReview',
            field=models.DateField(default=datetime.date.today),
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
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contingency', to='api.student')),
            ],
            options={
                'ordering': ['student'],
            },
        ),
        migrations.CreateModel(
            name='Stipend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, default=20000, max_digits=11, validators=[django.core.validators.MinValueValidator(0)])),
                ('disbursmentDate', models.DateField(default=datetime.date.today)),
                ('comment', models.TextField(blank=True, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stipend', to='api.student')),
            ],
            options={
                'ordering': ['student'],
            },
        ),
    ]
