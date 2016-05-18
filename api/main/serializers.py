import time
import datetime

from rest_framework import serializers

from .models import (
    Manager,
    User,
    Sensor,
    SensorDatum,
    Event,
    Session
)

import logging
logger = logging.getLogger(__name__)


class EpochDateTimeField(serializers.DateTimeField):
    def to_representation(self, value):
        try:
            return int(time.mktime(value.timetuple()) * 1000 + value.microsecond / 1000)
        except (AttributeError, TypeError):
            return None

    def to_internal_value(self, value):
        return datetime.datetime.fromtimestamp(value / 1000.0)


class SensorDatumSerializer(serializers.ModelSerializer):
    sensor_id = serializers.IntegerField(source='sensor.id')
    # sensor = serializers.PrimaryKeyRelatedField(source='sensor.id')
    user_id = serializers.PrimaryKeyRelatedField(source='sensor.user', read_only=True)
    label = serializers.CharField(source='sensor.label', read_only=True)
    time = EpochDateTimeField()

    class Meta:
        model = SensorDatum
        fields = ('id', 'user_id', 'sensor_id', 'session', 'label', 'time', 'value')


class SensorSerializer(serializers.ModelSerializer):
    # data_points = SensorDatumSerializer(source='data',
    #                                     many=True)
    # data_points = serializers.HyperlinkedIdentityField(view_name='sensordatum-with-session')

    class Meta:
        model = Sensor
        fields = ('id', 'label')


class ManagerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='django_user.username')
    # full_name = serializers.CharField(source='django_user.get_full_name')
    # dependents = UserSerializer(many=True)
    # sessions = serializers.HyperlinkedIdentityField(view_name='session-detail')
    sessions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Manager
        fields = ('id', 'username', 'sessions')


class EventSerializer(serializers.ModelSerializer):
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())
    time = EpochDateTimeField()

    class Meta:
        model = Event
        fields = ('id', 'time', 'notes', 'session')


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='django_user.username')
    # full_name = serializers.CharField(source='django_user.get_full_name')
    sensors = SensorSerializer(many=True, read_only=True)
    # sessions = SessionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'sensors')


class SessionSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(),
                                                 many=True)
    # members = UserSerializer(many=True)
    events = EventSerializer(many=True, read_only=True)
    sensor_data = SensorDatumSerializer(source='data', many=True, read_only=True)
    start_time = EpochDateTimeField()

    class Meta:
        model = Session
        fields = ('id', 'manager', 'members', 'start_time',
                  'video_url', 'events', 'sensor_data')
