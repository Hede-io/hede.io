import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import Title from './Title'
import {
  getAuthenticatedUser,
} from '../reducers';

import StoryLoading from '../components/Story/StoryLoading';
import './TitlesFeed.less';

import { Helmet } from 'react-helmet';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
  }),
  {},
)
export default class TitlesFeed extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    content: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    loadMoreContent: PropTypes.func,
    query: PropTypes.string
  };

  static defaultProps = {
    isFetching: false,
    hasMore: false,
    loadMoreContent: () => {},
    query:''
  };

  render() {
    const {
      content,
      isFetching,
      hasMore,
    } = this.props;

    return (
      <div>
      <Helmet>
        <title>Hede search results</title>
       </Helmet>
      <div className='TitlesFeed'><span>Search results for '{`${this.props.query}`}'</span></div>
        <ReduxInfiniteScroll
          loadMore={this.props.loadMoreContent}
          loader={<StoryLoading />}
          loadingMore={isFetching}
          hasMore={hasMore}
          elementIsScrollable={false}
          threshold={200}
        >
          {content.map((title) => {

            return (
            
            
              <Title key={title._id} title={title} />
            );
          })}
        </ReduxInfiniteScroll>
      
        </div>

    );
  }
}
