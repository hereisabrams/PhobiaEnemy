import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),

  manager: DS.attr('number'),
  start_time: DS.attr('date'),
  video_url: DS.attr('string'),

  events: DS.hasMany('event'),
  members: DS.hasMany('member')
});
