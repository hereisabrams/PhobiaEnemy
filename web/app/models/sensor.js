import DS from 'ember-data';

export default DS.Model.extend({
  label: DS.attr('string'),
  member: DS.belongsTo('member')
});
