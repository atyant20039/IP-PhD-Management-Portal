from rest_framework.exceptions import ParseError

def parse_filter_query(filter_query, model):
    # Parse the filter query string into a dictionary of filters
    filters = {}
    if filter_query:
        filter_list = filter_query.split(',')
        for filter_item in filter_list:
            key, value = filter_item.split('=')
            # Check if the field exists in the model
            if key in [field.name for field in model._meta.fields]:
                filters[key] = value
            else:
                raise ParseError(f"Invalid filter field: {key}")
    return filters
