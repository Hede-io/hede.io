import React from 'react';
import PropTypes from 'prop-types'; 
import { connect } from 'react-redux';

import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getFollowingList,
  // getUser,
} from '../../reducers';

import SignUp from '../../components/Sidebar/SignUp';

import Icon from 'antd/lib/icon';

import SideAnnouncement from '../../components/Sidebar/SideAnnouncement';
import TopicFilters from '../../components/Sidebar/TopicFilters';

import { getUser } from '../../actions/user';

import size from 'lodash/size';


@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
    //authenticatedUser: getAuthenticatedUser(state),
    //followingList: getFollowingList(state),
    currentTitle: state.currentTitle
  }), { getUser })
export default class RightSidebar extends React.Component {
  static propTypes = {
    //authenticated: PropTypes.bool.isRequired,
    //authenticatedUser: PropTypes.shape().isRequired,
    //followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
/*
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.currentTitle.name === nextProps.currentTitle.name )
      return false;
  }*/



  shouldComponentUpdate (nextProps) {
    const { location } = this.props;

    if (location && (location.pathname !== nextProps.location.pathname || location.search !== nextProps.location.search)) {
      return true;
    }

    if(!location)
      return true;

    if(this.props.currentTitle == null && nextProps.currentTitle!==null)
      return true;
      
    if(nextProps.currentTitle!=null && nextProps.currentTitle.name !== this.props.currentTitle.name)
      return true;

    return false;
  }

  constructor(props) {
    super(props);
    /*this.state = {
      user: {},
      authenticatedUser: {},
    };*/
  }

  /*
  constructor(props) {
    super(props);
    this.state = {
      loadedProjects: false,
      isOwner: false,
      project: null,
    };
  }

  loadSponsorship() {
    const { getProject, match } = this.props;
    const repoId = parseInt(match.params.repoId);
    getProject(match.params.platform, repoId).then(res => {
      if (res.status !== 404 && res.response.name) {
        this.setState({
          project: res.response,
        });
      } else {
        this.setState({
          project: null,
        });
      }
    })
  }
*/


  componentWillMount() {
    //this.setState({authenticatedUser: this.props.authenticatedUser});
    //this.setState({user: this.props.user});
  }

  render() {
    const { match, isTitle, location, currentTitle, history } = this.props;
    //const project = this.state.project;

    //console.log("currentTitle: ", currentTitle)
    if (!isTitle && !this.props.authenticated) {
      return (
        <SignUp />
      )
    }

    return (
      <span>
        {size(currentTitle)>0 &&
        <TopicFilters topic={currentTitle.name} tags={currentTitle.tags} filters={currentTitle.filters} location={{pathname:location.pathname, search:location.search}} history={history} />
        }
      </span>
    );
  }
}
