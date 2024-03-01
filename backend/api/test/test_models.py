import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from api.models import Student, validate_batch_format

# Testing validate_batch_format function:
def test_validate_batch_format_valid():
    valid_formats = [
        "January 2024",
        "October 2023",
        "December 2000"
    ]
    for format in valid_formats:
        assert validate_batch_format(format) is None

def test_validate_batch_format_invalid_month():
    invalid_formats = [
        "Januery 2024",
        "Octo br 2023",
        "12 2024"
    ]
    for format in invalid_formats:
        with pytest.raises(ValidationError):
            validate_batch_format(format)

def test_validate_batch_format_invalid_year():
    invalid_formats = [
        "January 2024x",
        "October 2023a",
        "December 20xx"
    ]
    for format in invalid_formats:
        with pytest.raises(ValidationError):
            validate_batch_format(format)

def test_validate_batch_format_missing_month():
    invalid_formats = [
        "2024",
        "December",
        " "
    ]
    for format in invalid_formats:
        with pytest.raises(ValidationError):
            validate_batch_format(format)

def test_validate_batch_format_missing_year():
    invalid_formats = [
        "January",
        "August ",
        "November  202"
    ]
    for format in invalid_formats:
        with pytest.raises(ValidationError):
            validate_batch_format(format)

