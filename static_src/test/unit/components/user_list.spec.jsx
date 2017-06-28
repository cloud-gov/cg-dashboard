  import '../../global_setup.js';

  import React from 'react';
  import { shallow } from 'enzyme';
  import UserList from '../../../components/user_list.jsx';
  import Loading from '../../../components/loading.jsx';

  describe('<UserList />', () => {
    it('renders a saving `loading` badge when passed the correct props', () => {
      const props = {
        saving: true,
        loading: false,
        users: [{}, {}]
      };

      const userList = shallow(<UserList { ...props } />);
      const loading = userList.find(Loading);
      const loadingProps = loading.props();

      expect(loading.length).toBe(1);
      expect(loadingProps.active).toBe(true);
      expect(loadingProps.text).toEqual('Saving');
    });

    it('does not render "Saving" `loading` badge when passed non-saving props', () => {
      const props = {
        saving: false,
        loading: false,
        users: [{}, {}]
      };

      const userList = shallow(<UserList {...props } />);
      const loading = userList.find(Loading);

      expect(loading.length).toBe(1);
      expect(loading.props().active).toBe(false);
    });
  });
