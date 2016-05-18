import DRFSerializer from './drf';
import DS from 'ember-data';

export default DRFSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    events: { embedded: 'always' },
    members: { embedded: 'always' }
    // sessions: { embedded: 'always' }
    // sensors: { embedded: 'always' },
    // dependents: { embedded: 'always' }
  }
});
