from django.contrib import admin

from .models import *

admin.site.register(Student)
admin.site.register(Advisor)
admin.site.register(Instructor)
# admin.site.register(Finance)
admin.site.register(YearlyReview)
admin.site.register(Stipend)
admin.site.register(Comprehensive)
admin.site.register(Contingency)
admin.site.register(ContingencyLogs)