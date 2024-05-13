# Generated by Django 5.0.2 on 2024-05-13 17:01

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_stipend_disbursmentdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stipend',
            name='disbursmentDate',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='stipend',
            name='month',
            field=models.IntegerField(default=5),
        ),
    ]
