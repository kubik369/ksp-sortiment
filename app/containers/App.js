import {connect} from 'react-redux';
import {get} from 'lodash';

import {App} from '../components/App';

function mapStateToProps(state) {
  return {
    addingStock: get(state, 'newStock.active', false),
    loggedIn: get(state, 'login.loggedIn', false),
    currentPage: get(state, 'currentPage', 0),
  };
}

export default connect(mapStateToProps, null)(App);
