import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import { getPostContent, getIsFetching, getIsPostEdited } from '../reducers';
import { getContent } from './postActions';
import Comments from '../comments/Comments';
import Loading from '../components/Icon/Loading';
import PostContent from './PostContent';
import RightSidebar from '../app/Sidebar/RightSidebar';
import LeftSidebar from '../app/Sidebar/LeftSidebar';

import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

import * as Actions from '../actions/constants';
import { getEntry, setEntry } from '../actions/entry';

import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';
import whereEq from 'ramda/src/whereEq';


@connect(
  (state, ownProps) => ({
    edited: getIsPostEdited(state, ownProps.match.params.permlink),
    content: getPostContent(state, ownProps.match.params.author, ownProps.match.params.permlink),
    fetching: getIsFetching(state),
    entries: state.entries,
    entry: state.entry,
    loading: state.loading,
  }), { getContent, getEntry, setEntry })
export default class Post extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    edited: PropTypes.bool,
    content: PropTypes.shape(),
    fetching: PropTypes.bool,
    getContent: PropTypes.func,
  };

  static defaultProps = {
    edited: false,
    content: undefined,
    fetching: false,
    getContent: () => {},
  };

  state = {
    commentsVisible: false,
  };

  componentWillMount() {
    const { entry, entries, getEntry, setEntry } = this.props;
    const paramAuthor = this.props.match.params.author;
    const paramPermlink = this.props.match.params.permlink;
    const stateEntry = find(whereEq({author: paramAuthor, permlink: paramPermlink}))(entries);

    if (stateEntry) {
      setEntry(stateEntry);
      return;
    }

    if (
      !Object.keys(entry || {}).length ||
      (entry.author !== paramAuthor || entry.permlink !== paramPermlink)
    ) {
      getEntry(paramAuthor, paramPermlink);
    }

  }


  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    const nextLocation = nextProps.location;

    if (location.pathname !== nextLocation.pathname) {
      const { author, permlink } = nextProps.match.params;
      const { entry, entries, getEntry, setEntry } = this.props;
      const stateEntry = find(propEq('author', author) && propEq('permlink', permlink))(entries);
      
      if (!Object.keys(entry).length) {
        if (stateEntry) {
          setEntry(stateEntry);
        } else {
          getEntry(author, permlink);
        }
        return;
      }

      if (entry.author !== author || entry.permlink !== permlink) {
        if (stateEntry) {
          setEntry(stateEntry);
        } else {
          getEntry(author, permlink);
        }
      }
    }

  }


  componentWillUnmount() {
    if (process.env.IS_BROWSER) {
      global.document.title = 'Hede';
    }
  }

  handleCommentsVisibility = (visible) => {
    if (visible) {
      this.setState({
        commentsVisible: true,
      });
    }
  };

  render() {
    const { entry, loading, content, fetching, edited, history, match, location } = this.props;
    const isLoading = !Object.keys(entry || {}).length || loading === Actions.GET_ENTRY_REQUEST;


    return (
      <div className="main-panel">
        <ScrollToTopOnMount />
       {!isLoading
                ? <PostContent history={history} content={entry} /> : <Loading />}
              {!isLoading
                && <VisibilitySensor onChange={this.handleCommentsVisibility} />}
              <div id="comments">
                {!isLoading
                  && <Comments show={this.state.commentsVisible} post={entry} />}
              </div>
        
      </div>
    );
  }
}
