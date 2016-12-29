import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {
  fetchProducts,
  changeNewStockId,
  changeNewStockSearch,
  changeNewStockQuantity,
  changeNewStockPrice,
  changeNewStockImageCheckbox,
} from '../actions/actions';
import {AddStock} from '../components/AddStock';

function mapStateToProps(state, props) {
  return {
    username: get(state, 'login.username', 'No user selected'),
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
      changeNewStockImageCheckbox,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddStock);
