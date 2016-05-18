import Ember from 'ember';

export default Ember.Component.extend({
  socketService: Ember.inject.service('websockets'),
  socketRef: null,

  willRender() {
    this._super(...arguments);

    const socket = this.get('socketService')
            .socketFor('ws://0.0.0.0:8000/c2');

    socket.on('open', this.onOpen, this);
    socket.on('message', this.onMessage, this);
    socket.on('close', this.onClose, this);

    this.set('socketRef', socket);
  },

  willDestroyElement() {
    this._super(...arguments);

    const socket = this.get('socketRef');

    socket.off('open', this.onOpen);
    socket.off('message', this.onMessage);
    socket.off('close', this.onClose);
  },

  onOpen(event) {
    console.log(`On open event has been called: ${JSON.stringify(event)}`);
  },

  onMessage(event) {
    console.log(`Message: ${event.data}`);
  },

  onClose(event) {
    console.log(`On close event has been called: ${event}`);
  },

  actions: {
    startSession() {
      this.get('socketRef').send('START', true);
    },

    stopSession() {
      this.get('socketRef').send('STOP', true);
    }
  }
});
