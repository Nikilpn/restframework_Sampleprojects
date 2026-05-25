import requests
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

# Replace 'yourapp' with your actual app name
# from yourapp.models import Category, Brand, Product, ProductImage, Tag, Review, Dimension


class Command(BaseCommand):
    help = "Bulk seed all products from DummyJSON API into the database"

    API_URL = "https://dummyjson.com/products"
    BATCH_SIZE = 30

    def handle(self, *args, **kwargs):
        from products.models import Category, Brand, Product, ProductImage, Tag, Review, Dimension

        # ── Step 1: Fetch ALL products from the API ──────────────────────────
        all_products = []
        skip = 0
        total = None

        while total is None or skip < total:
            self.stdout.write(f"📦 Fetching products {skip}–{skip + self.BATCH_SIZE}...")
            response = requests.get(self.API_URL, params={"limit": self.BATCH_SIZE, "skip": skip})
            response.raise_for_status()
            data = response.json()
            total = data["total"]
            all_products.extend(data["products"])
            skip += self.BATCH_SIZE

        self.stdout.write(f"✅ Fetched {len(all_products)} products. Starting bulk insert...\n")

        # ── Step 2: Bulk create Categories ───────────────────────────────────
        category_names = set(p["category"] for p in all_products)
        existing_categories = {c.name: c for c in Category.objects.filter(name__in=category_names)}

        new_categories = [
            Category(name=name)
            for name in category_names
            if name not in existing_categories
        ]
        Category.objects.bulk_create(new_categories, ignore_conflicts=True)

        # Reload all categories into a lookup dict
        category_map = {c.name: c for c in Category.objects.filter(name__in=category_names)}
        self.stdout.write(f"  Categories: {len(category_map)} ready.")

        # ── Step 3: Bulk create Brands ────────────────────────────────────────
        brand_names = set(p["brand"] for p in all_products if p.get("brand"))
        existing_brands = {b.name: b for b in Brand.objects.filter(name__in=brand_names)}

        new_brands = [
            Brand(name=name)
            for name in brand_names
            if name not in existing_brands
        ]
        Brand.objects.bulk_create(new_brands, ignore_conflicts=True)

        brand_map = {b.name: b for b in Brand.objects.filter(name__in=brand_names)}
        self.stdout.write(f"  Brands: {len(brand_map)} ready.")

        # ── Step 4: Bulk create Tags ──────────────────────────────────────────
        tag_names = set(tag for p in all_products for tag in p.get("tags", []))
        existing_tags = {t.name: t for t in Tag.objects.filter(name__in=tag_names)}

        new_tags = [
            Tag(name=name)
            for name in tag_names
            if name not in existing_tags
        ]
        Tag.objects.bulk_create(new_tags, ignore_conflicts=True)

        tag_map = {t.name: t for t in Tag.objects.filter(name__in=tag_names)}
        self.stdout.write(f"  Tags: {len(tag_map)} ready.")

        # ── Step 5: Bulk create Products ─────────────────────────────────────
        existing_skus = set(Product.objects.values_list("sku", flat=True))

        new_products = []
        for item in all_products:
            if item["sku"] in existing_skus:
                continue  # Skip already existing products
            new_products.append(Product(
                category=category_map[item["category"]],
                brand=brand_map.get(item.get("brand")),
                title=item["title"],
                description=item["description"],
                price=item["price"],
                discount_percentage=item["discountPercentage"],
                rating=item["rating"],
                stock=item["stock"],
                sku=item["sku"],
                weight=item["weight"],
                warranty_information=item["warrantyInformation"],
                shipping_information=item["shippingInformation"],
                availability_status=item["availabilityStatus"],
                return_policy=item["returnPolicy"],
                minimum_order_quantity=item["minimumOrderQuantity"],
                barcode=item["meta"]["barcode"],
                qr_code=item["meta"]["qrCode"],
                thumbnail=item["thumbnail"],
            ))

        Product.objects.bulk_create(new_products, batch_size=100)
        self.stdout.write(f"  Products: {len(new_products)} inserted.")

        # Reload product map by SKU for linking related objects
        sku_list = [p["sku"] for p in all_products]
        product_map = {p.sku: p for p in Product.objects.filter(sku__in=sku_list)}

        # ── Step 6: Bulk create Dimensions ───────────────────────────────────
        existing_dim_ids = set(Dimension.objects.values_list("product_id", flat=True))

        new_dimensions = []
        for item in all_products:
            product = product_map.get(item["sku"])
            dims = item.get("dimensions", {})
            if product and dims and product.id not in existing_dim_ids:
                new_dimensions.append(Dimension(
                    product=product,
                    width=dims["width"],
                    height=dims["height"],
                    depth=dims["depth"],
                ))

        Dimension.objects.bulk_create(new_dimensions, batch_size=100)
        self.stdout.write(f"  Dimensions: {len(new_dimensions)} inserted.")

        # ── Step 7: Bulk create Product Images ───────────────────────────────
        existing_image_product_ids = set(
            ProductImage.objects.values_list("product_id", flat=True).distinct()
        )

        new_images = []
        for item in all_products:
            product = product_map.get(item["sku"])
            if product and product.id not in existing_image_product_ids:
                for url in item.get("images", []):
                    new_images.append(ProductImage(product=product, image=url))

        ProductImage.objects.bulk_create(new_images, batch_size=200)
        self.stdout.write(f"  Images: {len(new_images)} inserted.")

        # ── Step 8: Bulk create Reviews ───────────────────────────────────────
        existing_review_product_ids = set(
            Review.objects.values_list("product_id", flat=True).distinct()
        )

        new_reviews = []
        for item in all_products:
            product = product_map.get(item["sku"])
            if product and product.id not in existing_review_product_ids:
                for review in item.get("reviews", []):
                    new_reviews.append(Review(
                        product=product,
                        rating=review["rating"],
                        comment=review["comment"],
                        reviewer_name=review["reviewerName"],
                        reviewer_email=review["reviewerEmail"],
                        date=parse_datetime(review["date"]),
                    ))

        Review.objects.bulk_create(new_reviews, batch_size=200)
        self.stdout.write(f"  Reviews: {len(new_reviews)} inserted.")

        # ── Step 9: Bulk add Tag–Product M2M relationships ────────────────────
        for item in all_products:
            product = product_map.get(item["sku"])
            if product:
                tags = [tag_map[t] for t in item.get("tags", []) if t in tag_map]
                if tags:
                    product.tags.set(tags)  # set() is efficient for M2M

        self.stdout.write(f"  Tag relationships: linked.")

        self.stdout.write(self.style.SUCCESS(
            f"\n🎉 Done! {len(all_products)} products seeded into the database."
        ))