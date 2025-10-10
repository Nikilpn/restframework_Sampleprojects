from django.shortcuts import render
from rest_framework import status
from rest_framework import generics
from fcmapp.serializers import RegisterSerializer,Loginserializer,FcmListSerializer,FcmNotificationSerializer,NotificationSerializer
from rest_framework.permissions import AllowAny,IsAdminUser,IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from django.contrib.auth import get_user_model
User = get_user_model() 
from fcmapp.serializers import FcmRegisterSerializer
     
from fcmapp.models import DeviceToken
from firebase_admin import messaging, credentials
import firebase_admin
from rest_framework import serializers
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from django.utils import timezone

# Create your views here.
class RegisterView(generics.GenericAPIView):
    """[step1[1]]---[user should register here]
    starting stage 1"""
    serializer_class=RegisterSerializer
    permission_classes=[AllowAny]
    
    def post(self,request,*args,**kwargs):

        serializer_instance=self.get_serializer(data=request.data)
        
        
        if serializer_instance.is_valid():
            user=serializer_instance.save()
            return Response({
                'user_id':user.id,
                'user_email':user.email
                },status.HTTP_200_OK
            )

        return Response(
           {'error':serializer_instance.errors
            },status=status.HTTP_400_BAD_REQUEST
    
        )
        
class LoginApiView(generics.GenericAPIView):
    """[step1[2]]---[user should login after register]
    starting stage 2"""
    serializer_class=Loginserializer
    permission_classes=[AllowAny]

    def post(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']    
        
        token= Token.objects.get(user=user)

        return Response({
            'user_id': user.id,
            'username': user.email,
            'token': token.key,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    
        
 


class RegisterFcmToken(generics.GenericAPIView):
    """fcm register add fcm token to send push notification"""
    """fcm token step [[add fcm]]no.1"""
 
    permission_classes = [IsAuthenticated]
    serializer_class = FcmRegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer_instance = self.get_serializer(data=request.data)
        authenticated_user = request.user
        
        if serializer_instance.is_valid():
            # Check if user already has FCM token
            if DeviceToken.objects.filter(user_email=authenticated_user).exists():  
                return Response({
                    'error': 'User already has FCM token. Cannot add another token.'
                }, status=status.HTTP_409_CONFLICT)
            
            # Create new FCM token
            DeviceToken.objects.create(
                user_email=authenticated_user,
                device_token=serializer_instance.validated_data['device_token']
            )
            return Response({
                'message': 'FCM token saved successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': 'FCM token cannot be saved',
            'details': serializer_instance.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
class FcmListAll(generics.ListAPIView):
    """List all FCM tokens - Admin only"""
    queryset = DeviceToken.objects.all()
    serializer_class = FcmListSerializer  # Your existing serializer
    permission_classes = [AllowAny]
    

class SendNotificationAuthenticatedUser(generics.GenericAPIView):
    """Send notification to authenticated user's own device"""
    serializer_class = FcmNotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer_instance = self.get_serializer(data=request.data)
        
        if serializer_instance.is_valid():
            authenticated_user = request.user
            message_text = serializer_instance.validated_data['message']
            title = serializer_instance.validated_data.get('title', 'Notification')
            
            try:
                # Get authenticated user's FCM token using your model structure
                device_token = DeviceToken.objects.get(user_email=authenticated_user)
                fcm_token = device_token.device_token
                
                # Send notification to user's own device
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=title,
                        body=message_text
                    ),
                    token=fcm_token
                )
                
                response = messaging.send(message)
                
                return Response({
                    'success': True,
                    'message': 'Notification sent to your device',
                    'user': authenticated_user.username,
                    'message_id': response
                }, status=status.HTTP_200_OK)
                
            except DeviceToken.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'No FCM token found for your account. Please register your device first.'
                }, status=status.HTTP_404_NOT_FOUND)
                
            except Exception as e:
                return Response({
                    'success': False,
                    'message': f'Failed to send notification: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'success': False,
            'errors': serializer_instance.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
        

class SendNotificationView(APIView):
    """send notification by entering fcm token manually...."""
    
    
    @swagger_auto_schema(request_body=NotificationSerializer)
    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        fcm_token = serializer.validated_data['fcm_token']
        message_text = serializer.validated_data['message']
        title = serializer.validated_data.get('title', 'Notification')
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=message_text
                ),
                token=fcm_token
            )
            
            response = messaging.send(message)
            
            return Response({
                'success': True,
                'message': 'Notification sent successfully',
                'message_id': response
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Failed to send notification: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class FcmTokenSendAllUsers(generics.GenericAPIView):
    """FCM token - push notification to all users using for loop"""
    permission_classes = [IsAdminUser]
    serializer_class = FcmNotificationSerializer
    
    def post(self, request, *args, **kwargs):
        serializer_instance = self.get_serializer(data=request.data)
        
        if serializer_instance.is_valid():
            message_text = serializer_instance.validated_data['message']
            title = serializer_instance.validated_data.get('title', 'Broadcast Notification')
            
            # Get all device tokens
            device_tokens = DeviceToken.objects.all()
            
            if not device_tokens.exists():
                return Response({
                    'success': False,
                    'message': 'No device tokens found in database'
                }, status=status.HTTP_404_NOT_FOUND)
            
            results = []
            success_count = 0
            failure_count = 0
            
            # For loop through each device token
            for token in device_tokens:
                try:
                    # Create FCM message for each user
                    message = messaging.Message(
                        notification=messaging.Notification(
                            title=title,
                            body=message_text
                        ),
                        data={
                            'type': 'broadcast',
                            'sender': 'Admin',
                            'admin_email': request.user.email,  
                            'sent_time': str(timezone.now())
                        },
                        token=token.device_token
                    )
                    
                    # Send notification to individual user
                    response = messaging.send(message)
                    
                    # Success result
                    results.append({
                        'user_email': token.user_email.email,
                        'user_id': token.user_email.id,
                        'success': True,
                        'message_id': response,
                        'token_preview': token.device_token[:20] + '...'
                    })
                    success_count += 1
                    
                    print(f"✅ Sent to {token.user_email.email}")
                    
                except Exception as e:
                    # Failure result
                    results.append({
                        'user_email': token.user_email.email,
                        'user_id': token.user_email.id,
                        'success': False,
                        'error': str(e),
                        'token_preview': token.device_token[:20] + '...'
                    })
                    failure_count += 1
                    
                    print(f"❌ Failed for {token.user_email.email}: {str(e)}")
            
            # Return comprehensive results
            return Response({
                'success': True,
                'message': f'Broadcast notification completed',
                'summary': {
                    'total_users': len(device_tokens),
                    'success_count': success_count,
                    'failure_count': failure_count,
                    'success_rate': f"{(success_count/len(device_tokens)*100):.1f}%" if len(device_tokens) > 0 else "0%"
                },
                'admin_info': {
                    'admin_email': request.user.email, 
                    'admin_id': request.user.id,
                    'is_staff': request.user.is_staff,
                    'sent_at': str(timezone.now())
                },
                'notification_details': {
                    'title': title,
                    'message': message_text
                },
                'detailed_results': results
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer_instance.errors
        }, status=status.HTTP_400_BAD_REQUEST)
