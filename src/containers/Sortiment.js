import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {Sortiment} from '../components/Sortiment';
import {increment, decrement} from '../actions/actions'

function mapStateToProps(state) {
  return {
    cart: get(state, 'cart', {}),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    increment,
    decrement,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sortiment);
