# Generated by Django 5.0.2 on 2024-04-28 03:19

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_stipend_disbursmentdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stipend',
            name='disbursmentDate',
            field=models.DateField(default=datetime.date(2024, 4, 28)),
        ),
    ]