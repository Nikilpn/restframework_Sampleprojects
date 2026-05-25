from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, null=True, blank=True)

    title = models.CharField(max_length=255)
    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.FloatField()
    rating = models.FloatField()

    stock = models.IntegerField()
    sku = models.CharField(max_length=100)

    weight = models.IntegerField()

    warranty_information = models.CharField(max_length=255)
    shipping_information = models.CharField(max_length=255)
    availability_status = models.CharField(max_length=100)

    return_policy = models.CharField(max_length=255)
    minimum_order_quantity = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    barcode = models.CharField(max_length=100)
    qr_code = models.URLField()

    thumbnail = models.URLField()

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.URLField()


class Tag(models.Model):
    name = models.CharField(max_length=100)
    products = models.ManyToManyField(Product, related_name='tags')


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')

    rating = models.IntegerField()
    comment = models.TextField()

    reviewer_name = models.CharField(max_length=100)
    reviewer_email = models.EmailField()

    date = models.DateTimeField()


class Dimension(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='dimensions')

    width = models.FloatField()
    height = models.FloatField()
    depth = models.FloatField()