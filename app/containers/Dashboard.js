import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {goToStep, fetchUsers, changeBalance, fetchProducts} from '../actions/actions';
import {Dashboard} from '../components/Dashboard';

function mapStateToProps(state, props) {
  return {
    username: get(state, 'username', 'No user selected'),
    cart: get(state, 'cart', {}),
    products: get(state, 'products.data', []),
    balance: get(state, `users.data[${get(state, 'username', '')}].balance`, 0),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({goToStep, fetchUsers, changeBalance, fetchProducts}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
