import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {Sortiment} from '../components/Sortiment';
import {fetchProducts} from '../actions/actions';

function mapStateToProps(state) {
  return {
    products: get(state, 'products', {}),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {fetchProducts},
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Sortiment);
