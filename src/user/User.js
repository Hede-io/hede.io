import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
} from '../reducers';

import { openTransfer } from '../wallet/walletActions';
import { getAccountWithFollowingCount } from './usersActions';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

import UserProfile from './UserProfile';
import UserComments from './UserComments';
import UserFollowers from './UserFollowers';
import UserFollowing from './UserFollowing';
import UserReblogs from './UserReblogs';
import UserFeed from './UserFeed';
import SubFeed from '../feed/SubFeed';

import {getEntries} from "../actions/entries";

export const needs = [getAccountWithFollowingCount, loadEntriesFirstTime];

import EmptyFeed from '../statics/EmptyFeed';

import * as Actions from '../actions/constants';


const loadEntriesFirstTime = (store, name)=> {
  const limit = 20;


  return store.dispatch(getEntries({
    limit,
    skip:0,
    section: 'author',
    sortBy: 'created',
    filterBy: '',
    author: name,
    status: 'any',
    moderator: 'any',
    type: 'all',
    sortDirection:'d',
    reset: true
  }));

}

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    user: getUser(state, ownProps.match.params.name),
    loading: state.loading,
  }), {
    getAccountWithFollowingCount,
    openTransfer,
  })
export default class User extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    getAccountWithFollowingCount: PropTypes.func,
    openTransfer: PropTypes.func,
  };

  static defaultProps = {
    getAccountWithFollowingCount: () => {},
    openTransfer: () => {},
  };

  //static needs = needs;

  static needs({ store, match }) {
    const { name } = match.params;
    return [
      store.dispatch(getAccountWithFollowingCount({name})),
      loadEntriesFirstTime(store, name),
    ];
  }


  constructor (props) {
    super (props);

    this.state = {
      popoverVisible: false,
    };
  }

  componentWillMount() {
    const {match} = this.props;
    if (!this.props.user.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name });
      return;
    }

  }


  componentDidUpdate(prevProps) {
    const {match, authenticatedUser, user} = this.props;

    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getAccountWithFollowingCount({ name: this.props.match.params.name });
    }

    if (prevProps.user !== user) {
      const isOnwer = authenticatedUser && authenticatedUser.name === match.params.name;

    }
  }

  handleUserMenuSelect = (key) => {
    if (key === 'transfer') {
      this.props.openTransfer(this.props.match.params.name);
      this.setState({
        popoverVisible: false,
      });
    }
  };

  handleVisibleChange = (visible) => {
    this.setState({ popoverVisible: visible });
  }

  render() {
    const { authenticated, authenticatedUser, match, loading } = this.props;
    const username = this.props.match.params.name;
    const { user } = this.props;
    const { profile = {} } = user.json_metadata || {};
    const busyHost = global.postOrigin || 'https://hede.io';
    const desc = profile.about || `Post by ${username}`;
    const image = `${process.env.STEEMCONNECT_IMG_HOST}/@${username}`;
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const displayedUsername = profile.name || username || '';
    const hasCover = !!profile.cover_image;
    const title = `${displayedUsername} - Wiki - Hede`;

    const isSameUser = authenticated && authenticatedUser.name === username;

    return (
      <div className="main-panel">
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={canonicalUrl} />
          <meta name="robots" content="noindex"/>

          <meta property="description" content={desc} />

          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Hede" />

          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={image || 'https://steemit.com/images/steemit-twshare.png'}
          />
        </Helmet>
        <ScrollToTopOnMount />
        {user && (
          <UserHero
            authenticated={authenticated}
            user={user}
            username={displayedUsername}
            isSameUser={isSameUser}
            hasCover={hasCover}
            onFollowClick={this.handleFollowClick}
            onSelect={this.handleUserMenuSelect}
            isPopoverVisible={this.state.popoverVisible}
            handleVisibleChange={this.handleVisibleChange}
          />
        )}
        <div className="shifted">
          <div className="feed-layout container">
            {typeof document !== "undefined" &&
            <div>
              <Affix className="leftContainer" stickPosition={72}>
                <div className="left">
                  <LeftSidebar />
                </div>
              </Affix>
              <Affix className="rightContainer" stickPosition={72}>
                <div className="right">
                
                </div>
              </Affix>
            </div>
            }
            <div className="center">
              <Route exact path={`${match.path}`} component={UserProfile} />
              
              <Route path={`${match.path}/followers`} component={UserFollowers} />
              <Route path={`${match.path}/followed`} component={UserFollowing} />
              {/*<Route path={`${match.path}/reblogs`} component={UserReblogs} />*/}
              {/*<Route path={`${match.path}/feed`} component={UserFeed} />*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
