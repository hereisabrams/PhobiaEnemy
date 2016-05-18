from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as authviews

from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'sensors', views.SensorViewSet)
router.register(r'sensor-data', views.SensorDatumViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'sessions', views.SessionViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^token-auth/', authviews.obtain_auth_token),
    url(r'^user-info/$', views.user_info),
    url(r'^user-info/(?P<pk>[0-9]+)/$', views.UserDetail.as_view())
]
