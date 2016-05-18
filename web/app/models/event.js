import DS from 'ember-data';

export default DS.Model.extend({
  time: DS.attr('date'),
  notes: DS.attr('string'),

  session: DS.belongsTo('session')
});
