import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {Product} from '../components/Product'

function mapStateToProps(state, props) {
  return {
    quantity: get(state, `cart.${props.type}`, 0),
    productInfo: get(state, `products.${props.type}`, {}),
  };
};

export default connect(mapStateToProps, null)(Product);
