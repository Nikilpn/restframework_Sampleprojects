"""
URL configuration for fcmproject2 project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from decouple import config
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Base URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('fcmapp/', include('fcmapp.urls'))
]

# Get swagger setting from environment
swagger = config('SWAGGER', default=True, cast=bool)

if swagger:
    schema_view = get_schema_view(
        openapi.Info(
            title="FCM Backend API",
            default_version='v1',
            description="API documentation for FCM Management System",
            terms_of_service="https://www.google.com/policies/terms/",
            contact=openapi.Contact(email="contact@example.com"),
            license=openapi.License(name="BSD License"),
        ),
        public=True,
        permission_classes=[permissions.AllowAny],
    )
    
    # Add swagger URLs
    urlpatterns += [
        path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
        re_path(r'^postman/$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    ]

# Static/Media files for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)