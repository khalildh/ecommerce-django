from django.conf.urls import url

from .views import (
    ProductListView, 
    # product_list_view, 
    # ProductDetailView,
    ProductDetailSlugView, 
    # product_detail_view,
    # ProductFeaturedListView,
    # ProductFeaturedDetailView,
)

urlpatterns = [
    url(r'^$', ProductListView.as_view()),
    url(r'^(?P<slug>[\w-]+)/$', ProductDetailSlugView.as_view()),
]