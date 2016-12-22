import { pageKinds } from '../constants';
import Model from './model';


const defaults = {
  kind: pageKinds.DEFAULT_PAGE,
  title: null
};

class PageMetadataModel extends Model('PageMetadata', defaults) {} // eslint-disable-line new-cap

export default PageMetadataModel;