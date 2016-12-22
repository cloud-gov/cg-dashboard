import Model from './model';


const defaults = {
  kind: null,
  title: null
};

class PageMetadataModel extends Model('PageMetadata', defaults) {} // eslint-disable-line new-cap

export default PageMetadataModel;
