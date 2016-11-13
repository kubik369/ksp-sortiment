import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {goToStep, changeUsername} from '../actions/actions';
import {Welcome} from '../components/Welcome';

function mapStateToProps(state, props) {
  return {

  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({goToStep, changeUsername}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
