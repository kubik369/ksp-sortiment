import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {
  goToStep,
  changeUsername,
  changeBalance,
} from '../actions/actions';
import {Registration} from '../components/Registration';

function mapStateToProps(state, props) {
  return {
    username: get(state, 'username', ''),
    balance: get(state, 'balance', 0),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    goToStep,
    changeUsername,
    changeBalance,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
