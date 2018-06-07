import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getFeed, getPosts, getPendingBookmarks, getIsReloading } from '../reducers';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { reload } from '../auth/authActions';
import { getBookmarks } from './bookmarksActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';

@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
    pendingBookmarks: getPendingBookmarks(state),
    reloading: getIsReloading(state),
  }),
  { getBookmarks, reload },
)
export default class Bookmarks extends React.Component {
  static propTypes = {
    reloading: PropTypes.bool,
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number),
    getBookmarks: PropTypes.func,
    reload: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    pendingBookmarks: [],
    getBookmarks: () => {},
    reload: () => {},
  };

  componentWillMount() {
    this.props.reload().then(() => this.props.getBookmarks());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pendingBookmarks.length < this.props.pendingBookmarks.length) {
      this.props.getBookmarks();
    }
  }

  render() {
    const { reloading, feed, posts, match } = this.props;

    const content = getFeedContentFromState('bookmarks', 'all', feed, posts);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed) || reloading;
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
    const loadContentAction = () => null;
    const loadMoreContentAction = () => null;

    const noBookmarks = !reloading && !isFetching && !content.length;

    return (
      <div className="shifted">
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <RightSidebar match={match}/>
            </div>
          </Affix>
          <div className="center">
            <Feed
              content={content}
              isFetching={isFetching}
              hasMore={hasMore}
              loadContent={loadContentAction}
              loadMoreContent={loadMoreContentAction}
            />
            {noBookmarks && (
              <div className="container">
                <h3 className="text-center">
                  <FormattedMessage
                    id="bookmarks_empty"
                    defaultMessage="You don't have any story saved."
                  />
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
