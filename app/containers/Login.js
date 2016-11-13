import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {goToStep, changeUsername, fetchUsers} from '../actions/actions';
import {Login} from '../components/Login';

function mapStateToProps(state, props) {
  return {
    username: get(state, 'username', ''),
    users: get(state, 'users.data', {}),
    fetching: get(state, 'users.fetching', false),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {goToStep, changeUsername, fetchUsers},
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
