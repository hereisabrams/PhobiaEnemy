from django.contrib import admin

from .models import (
    Manager,
    User,
    Sensor,
    SensorDatum,
    Event,
    Session
)

admin.site.register(Manager)
admin.site.register(User)
admin.site.register(Sensor)
admin.site.register(SensorDatum)
admin.site.register(Event)

# class SessionAdmin(admin.ModelAdmin):


admin.site.register(Session)

# class PatientAdmin(admin.ModelAdmin):
#     list_display = ('user', 'phobia', 'doctor')

# admin.site.register(Patient, PatientAdmin)


# class SensorSetAdmin(admin.ModelAdmin):
#     list_display = ('patient', 'date_time')

# admin.site.register(SensorSet, SensorSetAdmin)
