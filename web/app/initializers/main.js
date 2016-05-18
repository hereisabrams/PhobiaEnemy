import Ember from 'ember';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
}

if (Ember.Debug && typeof Ember.Debug.registerDeprecationHandler === 'function') {
    Ember.Debug.registerDeprecationHandler((message, options, next) => {
        if (options && options.until && options.until !== '2.5.0') {
            return;
        }
        next(message, options);
    });
}

export default {
  name: 'main',
  initialize
};
