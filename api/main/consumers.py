import json
from datetime import datetime
from channels import Channel, Group
from channels.sessions import channel_session

from .models import SensorDatum

import logging
logger = logging.getLogger(__name__)


def sensordatum_consumer(message):
    data = json.loads(message.content['message']['text'])
    data['time'] = datetime.strptime(data['time'],
                                     '%Y-%m-%dT%H:%M:%S.%fZ')

    # SensorDatum.objects.create(
    #     sensor=Sensor.objects.get(pk=message.content['sensor-id']),
    #     time=data['time'],
    #     value=data['value']
    # )

    Group('sensor-%s' % message.content['sensor-id']).send(
        message.content['message']
    )


def c2_consumer(message):
    logger.info(message.content)
    pass


@channel_session
def ws_connect(message):
    logger.info('MESSAGE ' + str(message.content))

    if message.content['path'] == b'/c2':
        # logger.info('command and control')
        Group('c2').add(message.reply_channel)
    else:
        sensor_id = message.content['query_string'].decode('utf-8').split('=')[1]
        # logger.info('SENSOR ID ' + str(sensor_id))
        message.channel_session['sensor-id'] = int(sensor_id)
        Group('sensor-%s' % sensor_id).add(message.reply_channel)


@channel_session
def ws_message(message):
    if message.content['path'] == b'/c2':
        Channel('c2').send({
            # TODO
            'message': message.content
        })
    else:
        Channel('sensor-data').send({
            'sensor-id': message.channel_session['sensor-id'],
            'message': message.content
        })


@channel_session
def ws_disconnect(message):
    if message.content['path'] == b'/c2':
        Group('c2').discard(message.reply_channel)
    else:
        Group('sensor-%s' % message.channel_session['sensor-id']).discard(
            message.reply_channel
        )
