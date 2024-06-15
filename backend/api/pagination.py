from rest_framework import pagination
from rest_framework.response import Response


class PageNumberPaginationWithCount(pagination.PageNumberPagination):
    page_size = 50

    def get_paginated_response(self, data):
        response = super(PageNumberPaginationWithCount, self).get_paginated_response(data)
        response.data['total_pages'] = self.page.paginator.num_pages
        response.data['page'] = self.page.number
        return response
    
class NoPagination(pagination.PageNumberPagination):
    def paginate_queryset(self, queryset, request, view=None):
        return None
    
    def get_paginated_response(self, data):
        return Response(data)