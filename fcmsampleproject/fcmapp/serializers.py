from rest_framework import serializers
from rest_framework import status
from rest_framework import response
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

from django.contrib.auth import get_user_model
User = get_user_model() 
from fcmapp.models import DeviceToken

class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(max_length=16)
    confirm_password=serializers.CharField(max_length=16)
    
    class Meta:
        model=User
        fields=['email','password','confirm_password']

    def validate(self,attrs):
        password=attrs.get('password')
        confirm_password=attrs.get('confirm_password')
        email=attrs.get('email')
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('email already exists')
        
        if password!=confirm_password:
            raise serializers.ValidationError(
                'password donot mathch'
            )
        return attrs
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)
    
class Loginserializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        user_email = attrs.get('email', '')
        user_password = attrs.get('password', '')
        
        if user_email and user_password:
            user = authenticate(email=user_email, password=user_password)
            if not user:
                raise serializers.ValidationError(
                    'Invalid email or password'  # ← Ith add cheyyuka
                )
            attrs['user'] = user  # ← User object store cheyyuka
        else:
            raise serializers.ValidationError(
                'Email and password required'  # ← Fields missing enkil
            )
        
        return attrs
    
class FcmRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=DeviceToken
        fields='__all__'
        read_only_fields=['user_email']
        
class FcmListSerializer(serializers.ModelSerializer):
    user_email_display = serializers.SerializerMethodField()  #add this(kanikkyan display cheyyan)
    
    class Meta:
        model = DeviceToken
        fields = ['id', 'device_token', 'user_email', 'user_email_display']  # ✅ Add new field
        read_only_fields = ['user_email']
    
    def get_user_email_display(self, obj):
        return obj.user_email.email  # ✅ Return actual email

# Simple serializer - only message and title
class FcmNotificationSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=500, help_text="Notification message")
    title = serializers.CharField(max_length=100, required=False, default='Notification', help_text="Notification title")


        
        
class NotificationSerializer(serializers.Serializer):
    fcm_token = serializers.CharField(max_length=1000)
    message = serializers.CharField(max_length=500)
    title = serializers.CharField(max_length=100, required=False, default='Notification')