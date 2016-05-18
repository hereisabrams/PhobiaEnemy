import datetime

from rest_framework.decorators import api_view, detail_route, list_route
from rest_framework import permissions, viewsets, generics
from rest_framework.response import Response

from .models import (
    Manager,
    User,
    Sensor,
    SensorDatum,
    Event,
    Session
)
from .serializers import (
    SensorDatumSerializer,
    SensorSerializer,
    UserSerializer,
    ManagerSerializer,
    EventSerializer,
    SessionSerializer
)

import logging
logger = logging.getLogger(__name__)


@api_view()
def user_info(request):
    try:
        u = User.objects.get(django_user=request.user)
        s = UserSerializer(u, context={'request': request})
        r = Response(s.data)
        r.data['is_manager'] = False
    except User.DoesNotExist:
        u = Manager.objects.get(django_user=request.user)
        s = ManagerSerializer(u, context={'request': request})
        r = Response(s.data)
        r.data['is_manager'] = True
    return r


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.usercommon.user)

    @detail_route(methods=['GET'])
    def data(self, request, pk=None):
        sensor = self.get_object()
        s = SensorDatumSerializer(sensor.data.all(),
                                  context={'request': request},
                                  many=True)
        return Response(s.data)


class SensorDatumViewSet(viewsets.ModelViewSet):
    queryset = SensorDatum.objects.all()
    serializer_class = SensorDatumSerializer

    def get_queryset(self):
        queryset = SensorDatum.objects.all()

        session_id = self.request.query_params.get('session', None)
        if session_id is not None:
            queryset = queryset.filter(session_id=session_id)

        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(sensor__user_id=user_id)

        return queryset

    def perform_create(self, serializer):
        # TODO does sensor belong to user?
        serializer.save(
            # sensor_id=self.request.data['sensor_id']
            sensor=Sensor.objects.get(pk=self.request.data['sensor_id'])
        )


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        serializer.save(
            session=Session.objects.get(pk=self.request.data['session'])
        )


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_queryset(self):
        queryset = Session.objects.all()

        time = self.request.query_params.get('time', None)
        if time is not None:
            parsed = datetime.datetime.fromtimestamp(int(time) / 1000.0)
            queryset = queryset.filter(start_time=parsed)

        return queryset
