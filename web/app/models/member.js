import DS from 'ember-data';

export default DS.Model.extend({
  session: DS.hasMany('session'),
  username: DS.attr('string'),
  sensors: DS.hasMany('sensor')
});
