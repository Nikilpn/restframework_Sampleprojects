from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny,IsAdminUser,IsAuthenticated
from dairyapp.models import dairy

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    password_confirm = serializers.CharField(max_length=68, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        if password != password_confirm:
            raise serializers.ValidationError("Passwords don't match")
        
        
        validate_password(password)
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return User.objects.create_user(**validated_data)
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255, write_only=True)  
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username', '') 
        password = attrs.get('password', '')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError('Invalid credentials, try again')
            if not user.is_active:
                raise serializers.ValidationError('Account disables')
            
      
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')



class DairySerializer(serializers.ModelSerializer):
    class Meta:
        model = dairy
        fields = ['user', 'Title', 'Description']


class DairyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = dairy
        fields = ['Title', 'Description']
        read_only_fields=['user']


