import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Controller.extend(UnauthenticatedRouteMixin, {
  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      const credentials = this.getProperties('identification', 'password');
      const authenticator = 'authenticator:token';

      this.get('session')
        .authenticate(authenticator, credentials)
        .catch((reason) => this.set('errorMessage',
                                    reason.non_field_errors || 'Both fields are required.'));
    }
  }
});
