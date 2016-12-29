import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {
  goToPage,
  changeRegistrationUsername,
  changeRegistrationBalance,
  logIn,
} from '../actions/actions';
import {Registration} from '../components/Registration';

function mapStateToProps(state, props) {
  return {
    username: get(state, 'registration.username', ''),
    balance: get(state, 'registration.balance', 0),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    goToPage,
    logIn,
    changeRegistrationUsername,
    changeRegistrationBalance,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
