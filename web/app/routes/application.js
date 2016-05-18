import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  model() {
    if (this.get('session.isAuthenticated')) {
      // const headers = {};
      // this.get('session').authorize('authorizer:token', (headerName, headerValue) => {
      //   headers[headerName] = headerValue;
      // });
      // return Ember.$.ajax('/api/doctor/', { headers });
      //return this.store.queryRecord('user', {});
	  //return this.store.findAll('session');
	  return Ember.RSVP.hash({
		  info: this.store.queryRecord('user', {}),
      sessions: this.store.findAll('session')
	  });
    } else {
      return {};
    }
  },

  sessionAuthenticated() {
    this._super();
    this.refresh();
  },

  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('index').set('appModel', model);
  }
});
