import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {
  fetchProducts,
  changeNewStockId,
  changeNewStockSearch,
  changeNewStockQuantity,
  changeNewStockPrice,
} from '../actions/actions';
import {NewStock} from '../components/NewStock';

function mapStateToProps(state, props) {
  return {
    username: get(state, 'username', 'No user selected'),
    products: get(state, 'products.data', []),
    fetchingProducts: get(state, 'products.fetching', true),
    newStock: get(state, 'newStock', {}),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchProducts,
      changeNewStockId,
      changeNewStockSearch,
      changeNewStockQuantity,
      changeNewStockPrice,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NewStock);
