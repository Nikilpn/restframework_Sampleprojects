
from django.urls import path
from fcmapp.views import RegisterView,LoginApiView,RegisterFcmToken,FcmListAll,SendNotificationAuthenticatedUser,SendNotificationView,FcmTokenSendAllUsers


urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('login/',LoginApiView.as_view(),name='login'),
    
    #for fcmtoken
    path('fcmregister/',RegisterFcmToken.as_view(),name='fcmregister'),
    path('fcmlistall/',FcmListAll.as_view(),name='fcmlist'),
    
    path('fcmsend-single-user/',SendNotificationAuthenticatedUser.as_view(),name='fcmsendsingleuser'),
    path('fcmnotificationbyenteringfcmtoken/',SendNotificationView.as_view(),name='fcmnotificationbyenteringfcmtoken'),
    path('fcmnotificationsend-all-users/',FcmTokenSendAllUsers.as_view(),name='fcmnotificationsend-all-users'),
]
