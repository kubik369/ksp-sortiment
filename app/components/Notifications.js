import React, {Component} from 'react';
import NotificationSystem from 'react-notification-system';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {get} from 'lodash';

import {clearNotification} from '../actions/notifications';
import {PATH_NOTIFICATIONS} from '../reducers/notifications';

const style = {
  NotificationItem: {
    DefaultStyle: {
      margin: '10px 5px 2px 1px',
      height: '70px',
      fontSize: '16px',
    },
  },
};

class Notifications extends Component {

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  componentWillReceiveProps(newProps) {
    const {message, level} = newProps.notification;
    if (message && level) {
      this.notificationSystem.addNotification({message, level});
      this.props.clearNotification();
    }
  }

  render() {
    return (
      <NotificationSystem ref="notificationSystem" style={style} />
    );
  }
}

export default connect(
  (state) => ({
    notification: get(state, [...PATH_NOTIFICATIONS]),
  }),
  (dispatch) => bindActionCreators({clearNotification}, dispatch)
)(Notifications);
