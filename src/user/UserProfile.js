import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SubFeed from '../feed/SubFeed';
import { Route } from 'react-router';

@connect(state => ({}), {})
export default class UserProfile extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  render() {
    const { match } = this.props;

    return (
      <div>
        <div className="profile">
          <Route path={`${match.path}`} component={ SubFeed } />
        </div>
      </div>
    );
  }
}
