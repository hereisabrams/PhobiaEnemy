import Ember from 'ember';

export default Ember.Component.extend({
  data: Ember.computed('sensorData.[]', function() {
    var id = this.get('member.id');
    return this.get('sensorData').objectAt(id);
  })
});
