from rest_framework import pagination


class PageNumberPaginationWithCount(pagination.PageNumberPagination):
    page_size = 50

    def get_paginated_response(self, data):
        response = super(PageNumberPaginationWithCount, self).get_paginated_response(data)
        response.data['total_pages'] = self.page.paginator.num_pages
        response.data['page'] = self.page.number
        return response