import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  userInfo: new Array(100),
  sensorData: new Array(100),

  currTime: null,

  modelChanged: Ember.observer('model', function() {
    // const headers = {};
    // this.get('session').authorize('authorizer:token', (headerName, headerValue) => {
    //   headers[headerName] = headerValue;
    // });

    var sessionId = this.get('model.id');

    var members = this.get('model.members');
    members.forEach((member, index) => {
      var memberId = member.get('id');

      var memberInfo = this.store.findRecord('member', memberId, { reload: true });
      memberInfo.then((data) => {
        members.insertAt(index, data);
      });

      var url = '/api/sensor-data/?session=' +
            sessionId + '&user=' + memberId;

      Ember.$.ajax(url, {
        // headers: headers,
        success: (data) => {
          this.get('sensorData').insertAt(memberId, data);
        }
      });
    });
  }),

  actions: {
    selectEvent(time) {
      this.set('selectedTime', time);

      var startTime = this.get('model.start_time');
      var seek = Math.abs((time - startTime) / 1000);

      var video = document.getElementById('video');
      video.currentTime = seek;
    },

    videoTimeUpdate() {
      var startTime = this.get('model.start_time').getTime();

      var video = document.getElementById('video');
      var videoTime = Math.floor(video.currentTime * 1000);

      var sessionCurrTime = Math.abs(startTime + videoTime);

      var r = new Date(sessionCurrTime);
      this.set('currTime', r);
      // console.log(sessionCurrTime);
    }
  }
});
