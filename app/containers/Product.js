import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {Product} from '../components/Product';
import {addToCart} from '../actions/actions';

function mapStateToProps(state, props) {
  return {
    quantity: get(state, `cart[${props.id}]`, 0),
    productInfo: get(state, `products.data[${props.id}]`, {}),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addToCart}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
