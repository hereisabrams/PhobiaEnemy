import DS from 'ember-data';

export default DS.Model.extend({
  // sensor: DS.belongsTo('sensor'), TODO
  // session: DS.belongsTo('session'),

  sensor_id: DS.attr('number'),
  session: DS.attr('number'),
  label: DS.attr('string'),
  time: DS.attr('date'),
  value: DS.attr('number')
});
