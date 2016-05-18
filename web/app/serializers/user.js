import DRFSerializer from './drf';
import DS from 'ember-data';

export default DRFSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    sessions: { embedded: 'always' }
    // sensors: { embedded: 'always' },
    // dependents: { embedded: 'always' }
  }
});
