import Ember from 'ember';
import MainInitializer from 'web/initializers/main';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | main', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  MainInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
