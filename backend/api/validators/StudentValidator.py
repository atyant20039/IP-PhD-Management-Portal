import datetime
import re
from django.core.exceptions import ValidationError

def rollNo(value):
    if not value.startswith('PhD') or not value[3:].isdigit() or len(value) < 6:
        raise ValidationError('Invalid Roll Number format. Please use the following format: PhDxxxxx')

def email(value):
    if not value.endswith('@iiitd.ac.in') or value.count('@') != 1:
        raise ValidationError('Invalid EmailId format. It should end with "@iiitd.ac.in"')


def batch(value):
    if not value or not re.match(r'^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$', value):
        raise ValidationError('Invalid batch format. Please use the following format: Month YYYY')

def dateSequence(jd, tsd, tdd, tdy, yol):
    validate_date_order(jd, tsd)
    validate_date_order(tsd, tdd)
    validate_date_order(tdy, yol)

def validate_date_order(earlier_date, later_date):
    if earlier_date and later_date:
        if later_date < earlier_date:
            raise ValidationError(f'Invalid value: {later_date}. It should be equal to or after {earlier_date}.')
