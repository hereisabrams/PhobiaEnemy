import DS from 'ember-data';
import DRFSerializer from 'ember-django-adapter/serializers/drf';

export default DRFSerializer.extend({
  // TODO Can be removed when PATCH support lands
  // serialize: function (record, options) {
  //   var self = this;
  //   var json = {};
  //   var inFlightAttrs = Object.keys(record.get('_inFlightAttributes'));

  //   if(options && options.includeId) {
  //     if(record.get('id')) {
  //       json[this.get('primaryKey')] = record.get('id');
  //     }
  //   }

  //   record.eachAttribute(function (key, attribute) {
  //     if(inFlightAttrs.indexOf(key) !== -1) {
  //       self.serializeAttribute(record, json, key, attribute);
  //     }
  //   });

  //   record.eachRelationship(function (key, relationship) {
  //     if(relationship.kind === 'belongsTo') {
  //       self.serializeBelongsTo(record, json, relationship);
  //     } else if(relationship.kind === 'hasMany') {
  //       self.serializeHasMany(record, json, relationship);
  //     }
  //   });

  //   return json;
  // }
});
