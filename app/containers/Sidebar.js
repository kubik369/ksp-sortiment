import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {get} from 'lodash';

import {goToPage, logOut} from '../actions/actions';

import {Sidebar} from '../components/Sidebar';

function mapStateToProps(state) {
  return {
    addingStock: get(state, 'newStock.active', false),
    loggedIn: get(state, 'login.loggedIn', false),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({goToPage, logOut}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
