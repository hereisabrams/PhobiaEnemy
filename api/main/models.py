from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """Create an auth token for every new user."""
    if created:
        Token.objects.create(user=instance)


class UserCommon(models.Model):
    django_user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                       on_delete=models.CASCADE)


class Manager(UserCommon):
    def __str__(self):
        return self.django_user.username


class User(UserCommon):
    def __str__(self):
        return self.django_user.username


class Sensor(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='sensors')
    label = models.CharField(max_length=20)

    def __str__(self):
        return self.label


class SensorDatum(models.Model):
    sensor = models.ForeignKey(Sensor,
                               on_delete=models.CASCADE,
                               related_name='data')
    session = models.ForeignKey('Session',
                                related_name='data')

    time = models.DateTimeField()
    # time = models.TimeField()
    value = models.FloatField()

    def __str__(self):
        return str(self.time)


class Event(models.Model):
    time = models.DateTimeField()
    # time = models.TimeField()
    notes = models.CharField(max_length=256)
    session = models.ForeignKey('Session',
                                related_name='events')


class Session(models.Model):
    manager = models.ForeignKey(Manager, related_name='sessions')
    members = models.ManyToManyField(User)

    start_time = models.DateTimeField()
    # finished = models.BooleanField(default=False)
    video_url = models.URLField(blank=True)
    # events = models.ForeignKey(Event, blank=True)

    def __str__(self):
        return str(self.pk)
