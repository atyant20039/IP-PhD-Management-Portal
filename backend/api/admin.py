from django.contrib import admin
from .models import Student, Advisor, Finance, Instructor, YearlyReview, Comprehensive

# Register your models here.
admin.site.register(Student)
admin.site.register(Advisor)
admin.site.register(Finance)
admin.site.register(Instructor)
admin.site.register(YearlyReview)
admin.site.register(Comprehensive)