from django.contrib import admin

# Register your models here.
from products.models import *
 
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(ProductImage)
admin.site.register(Tag)
admin.site.register(Review)
admin.site.register(Dimension)
