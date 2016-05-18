import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  // model() {
  //   // Só para utilizadores, managers não
  //   if (this.get('session.isAuthenticated')) {
  //     return this.store.findAll('sensor');
  //   } else {
  //     return [];
  //   }
  // }
});
