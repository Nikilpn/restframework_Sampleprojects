from dairyapp import views
from django.urls import path
from dairyapp.views import UserRegisterApiView,LoginAPIView,DairyAPIView,DairyCreateS,DairyListApiView,UserRegisterView,UpdateDairyApiView,DairyDeleteApiView


urlpatterns=[
    #using genricsapiview
    path('register/accountold', UserRegisterApiView.as_view(), name='registerold'),

    

    
    path('login/',LoginAPIView.as_view(),name='login'),
    path('dairy/',DairyAPIView.as_view(),name="dairycreate"),
    
    path('dairynewcreate/',DairyCreateS.as_view(),name='dairynewcreate'),
    path('dairynewlist/',DairyListApiView.as_view(),name='dairylist'),
    path('dairy-update/<int:pk>/',UpdateDairyApiView.as_view(),name='update'),
    path('dairy-delete/<int:pk>/',DairyDeleteApiView.as_view(),name='delete'),
    
    #using apiview
    path('register/accountnew', UserRegisterView.as_view(), name='registernew'),
    
]