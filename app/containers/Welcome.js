import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {Welcome} from '../components/Welcome';
import {fetchUsers, logIn} from '../actions/actions';

function mapStateToProps(state) {
  return {
    users: get(state, 'users.data', {}),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {fetchUsers, logIn},
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
