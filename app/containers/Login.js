import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {startAddingNewStock, searchUsername, logIn, fetchUsers} from '../actions/actions';
import {Login} from '../components/Login';

function mapStateToProps(state, props) {
  return {
    users: get(state, 'users.data', {}),
    loggedIn: get(state, 'login.loggedIn', false),
    search: get(state, 'login.search', ''),
    username: get(state, 'login.username', ''),
    balance: get(state, `users.data[${get(state, 'login.username', '')}].balance`, 0),
    fetching: get(state, 'users.fetching', false),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      searchUsername,
      logIn,
      fetchUsers,
      startAddingNewStock,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
