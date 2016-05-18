import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  // full_name: DS.attr('string'),
  // phobia: DS.attr('string'),
  is_manager: DS.attr('boolean'),
  // sensors: DS.hasMany('sensor'),

  // manager: DS.belongsTo('user', { inverse: 'dependents' }),
  // dependents: DS.hasMany('user', { inverse: 'manager' })
  sessions: DS.hasMany('session')
  // sessions: DS.belongsTo('session')
});
