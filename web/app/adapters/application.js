import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import DRFAdapter from 'ember-django-adapter/adapters/drf';
import ENV from 'web/config/environment';

export default DRFAdapter.extend(DataAdapterMixin, {
  // primaryKey: '_id',
  host: Ember.computed(() => ENV.APP.API_HOST),
  namespace: Ember.computed(() => ENV.APP.API_NAMESPACE),
  authorizer: 'authorizer:token',

  // TODO Can be removed when PATCH support lands
  updateRecord: function(store, type, snapshot) {
    var data = {};
    var serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    var id = snapshot.id;
    var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

    return this.ajax(url, 'PATCH', { data: data });
  }
});

// export default DS.RESTAdapter.extend(DataAdapterMixin, {
//   // host: 'http://0.0.0.0:8000',
//   // namespace: 'api',
//   authorizer: 'authorizer:token'
//   // buildURL(type, id, record) {
//   //   return this._super(type, id, record) + '/';
//   // }
// });
