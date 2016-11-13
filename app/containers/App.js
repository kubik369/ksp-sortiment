import {connect} from 'react-redux';
import {get} from 'lodash';

import {App} from '../components/App';

function mapStateToProps(state) {
  return {
    currentStep: get(state, 'currentStep'),
  };
}

export default connect(mapStateToProps, null)(App);
