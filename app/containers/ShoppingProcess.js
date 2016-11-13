import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {goToStep} from '../actions/actions';
import {ShoppingProcess} from '../components/ShoppingProcess';

function mapStateToProps(state, props) {
  return {
    currentStep: get(state, 'currentStep'),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    goToStep,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingProcess);
