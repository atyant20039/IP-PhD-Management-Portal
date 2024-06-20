# Generated by Django 5.0.2 on 2024-06-20 02:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_contingencylogs_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instructor',
            name='emailId',
            field=models.EmailField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='stipend',
            name='month',
            field=models.IntegerField(default=6),
        ),
    ]
