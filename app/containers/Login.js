import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {startAddingNewStock, searchUsername, logIn, logOut, fetchUsers} from '../actions/actions';
import {Login} from '../components/Login';

function mapStateToProps(state, props) {
  return {
    users: get(state, 'users.data', {}),
    loggedIn: get(state, 'login.loggedIn', false),
    search: get(state, 'login.search', ''),
    username: get(state, 'login.username', ''),
    fetching: get(state, 'users.fetching', false),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      searchUsername,
      logIn,
      logOut,
      fetchUsers,
      startAddingNewStock,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
