import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {fetchUsers, changeBalance} from '../actions/actions';
import {AddCredit} from '../components/AddCredit';

function mapStateToProps(state, props) {
  return {
    username: get(state, 'login.username', 'No user selected'),
    balance: get(state, 'balance', 0),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchUsers, changeBalance}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCredit);
