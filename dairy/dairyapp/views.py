from django.shortcuts import render
from rest_framework import generics,status,permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from dairyapp.serializers import UserRegistrationSerializer,UserLoginSerializer,DairyUpdateSerializer
from rest_framework.authtoken.models import Token
from dairyapp.models import User,dairy
from dairyapp.serializers import DairySerializer

from rest_framework.generics import GenericAPIView
# Create your views here.
class UserRegisterApiView(generics.GenericAPIView):
    serializer_class=UserRegistrationSerializer
    permission_classes=[AllowAny]
    def post(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            
            return Response({
                'user_id': user.id,
                'username':user.username,
                'token': user.token,
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
            


class LoginAPIView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Get or create token
        # token, created = Token.objects.get_or_create(user=user)
        token = Token.objects.get(user=user)
        
        return Response({
            'user_id': user.id,
            'username': user.username,
            'token': token.key,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
        
        
class DairyAPIView(generics.ListCreateAPIView):
    serializer_class = DairySerializer
    permission_classes = [IsAdminUser]


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        return dairy.objects.filter(user=self.request.user)
        


#sample study

class DairyCreateS(generics.GenericAPIView):
    serializer_class = DairySerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        authenticated_user = request.user
        user_id = request.data.get('user')
        
   
        if user_id and int(user_id) != authenticated_user.id:
            return Response(
                {'error': 'You can only create diary entries for yourself'},
                status=status.HTTP_403_FORBIDDEN
            )
   
        serializer_data = {
            'user': authenticated_user.id,
            'Title': request.data.get('Title'),
            'Description': request.data.get('Description')
        }
        
        serializer = self.get_serializer(data=serializer_data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
from dairyapp.utils.pagination import CustomPagination
    
class DairyListApiView(generics.GenericAPIView):
    pagination_class = CustomPagination
    serializer_class = DairySerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        authenticated_user = request.user
        dairy_entries = dairy.objects.filter(user=authenticated_user)
        
        # Get paginator instance and paginate the queryset
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(dairy_entries, request, view=self)
        
        if page is not None:

            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # If no pagination, serialize all data
        serializer = self.get_serializer(dairy_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class UpdateDairyApiView(generics.GenericAPIView):
    """API view to update dairy records"""
    serializer_class = DairyUpdateSerializer
    permission_classes = [IsAuthenticated]
    queryset = dairy.objects.all() 
    def put(self, request, *args, **kwargs):
        authenticated_user = request.user
        
        
        dairy_id = kwargs.get('pk')
        if dairy_id:
            try:
                dairy_instance = dairy.objects.get(id=dairy_id, user=authenticated_user)
            except dairy.DoesNotExist:
                return Response(
                    {"error": "Dairy record not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Serialize and validate the data
        serializer = self.serializer_class(
            dairy_instance, 
            data=request.data, 
            partial=True  # Allow partial updates
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Dairy record updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    "error": "Validation failed",
                    "details": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
            
            
class DairyDeleteApiView(generics.GenericAPIView):
    serializer_class = DairyUpdateSerializer
    permission_classes = [IsAuthenticated]
    queryset = dairy.objects.all()  # Swagger നു വേണ്ടി add ചെയ്തുiW
    
    def delete(self, request, *args, **kwargs):
        authenticated_user = request.user
        dairy_id = kwargs.get('pk')
        
        if not dairy_id:
            return Response(
                {"error": "Dairy ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
           
            dairy_instance = dairy.objects.get(id=dairy_id, user=authenticated_user.id)
            
  
            serializer_instance = self.get_serializer(data=request.data)
            if serializer_instance.is_valid():
      
                dairy_instance.delete()
                
                return Response(
                    {"message": "Dairy record deleted successfully"},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Invalid data", "details": serializer_instance.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except dairy.DoesNotExist:
            return Response(
                {"error": "Dairy record not found or access denied"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Deletion failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        



#self.get_serializer ennu parannju thanne vilikkyanam
class UserRegisterView(GenericAPIView):
    serializer_class=UserRegistrationSerializer
    def post(self,request,*args,**kwargs):
        serializer_instance=self.get_serializer(data=request.data)
        if serializer_instance.is_valid():
            user=serializer_instance.save()
            return Response(
                {
                "user_id":user.id,
                "user_name":user.username,
                'token': user.token,
                'message': 'User created successfully'
            
                }
            )
        return Response(
            serializer_instance.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
