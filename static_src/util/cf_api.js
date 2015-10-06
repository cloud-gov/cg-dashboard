
import http from 'axios';

const APIV = '/v2';

export default {
  getAuthStatus() {
    return http.get(APIV + '/authstatus')
      .then((res) => {
        return res.data.status;
      });
  },
};
