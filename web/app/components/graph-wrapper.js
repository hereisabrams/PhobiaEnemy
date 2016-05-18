import Ember from 'ember';

export default Ember.Component.extend({
  socketService: Ember.inject.service('websockets'),
  socketRef: null,

  willRender() {
    const socket = this.get('socketService')
            .socketFor('ws://0.0.0.0:8000/lel?sensor-id=' + this.get('sensor.id'));

    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);

    console.log('ws://0.0.0.0:8000/lel?sensor-id=' + this.get('sensor.id'));
  },

  willDestroyElement() {
    const socket = this.get('socketRef');

    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);
  },

  myOpenHandler(event) {
    console.log(`On open event has been called: ${event}`);
  },

  myMessageHandler(event) {
    console.log(`Message: ${event.data}`);
    var data = JSON.parse(event.data);
    data.time = new Date(data.time);
    // this.get('sensor.data_points').push(JSON.parse(event.data));
    this.get('sensor.data_points').pushObject(data);
    console.log(this.get('sensor.data_points'));
  },

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  },

  actions: {
    sendButtonPressed() {
      const socket = this.get('socketRef');
      socket.send('Hello Websocket World');
    }
  }
});
