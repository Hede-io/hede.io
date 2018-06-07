import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from '../actions/constants';
import { Link } from 'react-router-dom';
import Feed from './Feed';
import EmptyFeed from '../statics/EmptyFeed';
import ScrollToTop from '../components/Utils/ScrollToTop';
import TitlesFeed from './TitlesFeed'
import { getIsAuthenticated, getAuthenticatedUser } from '../reducers';

import { searchTitles } from '../actions/titles';
import { getModerators } from '../actions/moderators';
import Tabs from 'antd/lib/tabs';
import Icon from 'antd/lib/icon';


import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
    titles: state.titles,
    titlesFound: state.titlesFound,
    loading: state.loading,
    moderators: state.moderators,
  }),
  {
    searchTitles,
    getModerators
  },
)
class SearchFeed extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    moderators: PropTypes.array,
    location: PropTypes.shape().isRequired,

  };

  state = {
    skip: 0,
  };

  constructor(props) {
    super(props);
    this.loadResults = this.loadResults.bind(this);
    this.total = 0;
    this.toRenderTitles = [];
    this.query = ''
  }

  componentWillMount() {
    const { moderators, getModerators, match, history } = this.props;
    if (!moderators || !moderators.length) {
        getModerators();
    }
  }

  componentDidMount() {
    this.loadResults();
  }

  isModerator () {
    const { moderators, user } = this.props;
    return find(propEq('account', user.name))(moderators)
  }


  loadResults (nextProps = false) {

    const { match, titlesFound, user, loading, titles, location:{search} } = nextProps || this.props;
    const q = new URLSearchParams(search).get('q');
    this.query = q
    //const q = match.params.query;
    const searchSection = match.params.searchSection;
    const skip =  nextProps ? 0 : this.state.skip;
    const limit = 20;
    this.total = nextProps ? 0 : this.total;
    this.toRenderTitles= nextProps ? [] : this.toRenderTitles;
    
    if(this.total !== 0 && this.total <= this.state.skip){
      return;
    }

    this.props.searchTitles({
      limit,
      skip,
      section: 'all',
      sortBy: 'created',
      type: searchSection,
      bySimilarity: q,
      reset: nextProps,
    }).then(res => {
      this.total = res.response.total;
      this.toRenderTitles = [...this.toRenderTitles, ...res.response.results];
      this.setState({skip: skip + limit});
    }); 
    
  }

  renderResults () {
    const { titles, match, user } = this.props;
    //const titles = this.toRenderTitles;
    const { searchSection } = match.params;

    return titles;
  }


  componentWillReceiveProps (nextProps) {
    const { location } = this.props;

    if (location.search !== nextProps.location.search) {
      this.total = 0;
      this.toRenderTitles = [];
      this.loadResults(nextProps);
    }
  }


  render() {
    const { loading, history, match, location:{search}, isModerator } = this.props;
    const { searchSection } = match.params;
    const results = this.toRenderTitles;
    const isFetching = loading === Actions.GET_TITLES_REQUEST;
    const hasMore = this.total > results.length;
    const q = new URLSearchParams(search).get('q');

    return (
      <div>
        <ScrollToTop />

        
        <TitlesFeed
            content={ results }
            isFetching={ isFetching }
            hasMore={ hasMore }
            loadMoreContent={ this.loadResults }
            query={q}
            />
          
        {!results.length && !isFetching && <EmptyFeed
          text={'No titles found. Try again'}
        />}
      </div>
    );
  }
}

export default SearchFeed;
