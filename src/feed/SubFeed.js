import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import * as Actions from "../actions/constants";
import Feed from "./Feed";
import EmptyFeed from "../statics/EmptyFeed";
import ScrollToTop from "../components/Utils/ScrollToTop";
import {getIsAuthenticated, getAuthenticatedUser} from "../reducers";

import {getModerators} from "../actions/moderators";
import {getEntries} from "../actions/entries";

import CategoryIcon from '../components/CategoriesIcons';

import Tabs from "antd/lib/tabs";
import Icon from "antd/lib/icon";


import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

import "./SubFeed.less";

const TabPane = Tabs.TabPane;


@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
    loading: state.loading,
    moderators: state.moderators,
    entries: state.entries
  }),
  {
    getEntries,
    getModerators
  },
)
class SubFeed extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    moderators: PropTypes.array,
    isOwner: PropTypes.bool,
  };

  state = {
    skip: 0,
  };

  constructor(props) {
    super(props);
    this.loadEntries = this.loadEntries.bind(this);
    this.total = 0;
  }

  isModerator () {
    if (!this.props || !this.props.moderators) return false;
    const { moderators, user } = this.props;
    return find(propEq('account', user.name))(moderators)
  }

  componentWillMount() {
    const { moderators, getModerators, match, history } = this.props;
    
    if (!moderators || !moderators.length) {
        getModerators();
     }

  }

  componentDidMount() {
    // console.log("[c] Subfeed mounted")
    this.loadEntries();
  }

  componentWillReceiveProps (nextProps) {
    const { location } = this.props;
    // console.log("[c] componentwil")
    if (location.pathname !== nextProps.location.pathname) {
      this.total = 0; // @TODO antipattern - requires better implementation
      this.loadEntries(nextProps);
    }
  }

  loadEntries (nextProps = false) {
    const { match, getEntries, user } = nextProps || this.props;
    const skip =  nextProps ? 0 : this.state.skip;
    // console.log('[c] m',match);
    const limit = 20;
    this.total = nextProps ? 0 : this.total;


    return getEntries({
      limit,
      skip,
      section: 'author',
      sortBy: 'created',
      filterBy: '',
      author: match.params.name,
      status: 'any',
      moderator: 'any',
      type: match.params.type || 'all',
      sortDirection:'d',
      reset: (skip == 0)
    }).then(res => {
      this.total = res.response.total;
      this.setState({skip: skip + limit});
    });
  
  }


  render() {
    const { loading, history, match, loaded, location, isModerator, isOwner, project, entries } = this.props;

    const isFetching = loading === Actions.GET_ENTRIES_REQUEST;
    const hasMore = this.total > entries.length;

    return (
      <div>
        <ScrollToTop />
       

        <Feed
          content={ entries }
          isFetching={ isFetching }
          hasMore={ hasMore }
          loadMoreContent={ this.loadEntries }
          contentType={ match.params.type }
          showTitle={true}
            />
        {!entries.length && !isFetching && <EmptyFeed type={match.params.type} />}
      </div>
    );
  }
  
}

export default SubFeed;
