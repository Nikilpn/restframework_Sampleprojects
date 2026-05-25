from django.urls import path
from .views import *

urlpatterns = [
    path('category/',categoryListView.as_view()),
    path('products/', ProductListView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),
]