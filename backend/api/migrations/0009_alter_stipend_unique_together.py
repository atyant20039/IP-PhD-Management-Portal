# Generated by Django 5.0.2 on 2024-04-28 11:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_student_contingencyyears_student_stipendmonths_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='stipend',
            unique_together={('student', 'month', 'year')},
        ),
    ]
