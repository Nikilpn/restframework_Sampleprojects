from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Product,Category
from .serializers import ProductSerializer,categorySerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class categoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = categorySerializer