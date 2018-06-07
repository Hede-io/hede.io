import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getIsAuthenticated, getAuthenticatedUser } from '../reducers';
import { getUser } from '../actions/user';

import Icon from 'antd/lib/icon'; 

import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import StoryPreview from '../components/Story/StoryPreview';
import TopicSelector from '../components/TopicSelector';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import BodyShort from '../components/Story/BodyShort';
import { NavLink } from 'react-router-dom';

import './Title.less';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
  }),
  { 
    getUser,
  }
)
class Title extends React.Component {
  static propTypes = {
    title: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
   
  }

  render() {
    const { title } = this.props;
   
    return (
      <div>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="Title" style={{marginLeft:20, marginRight:20}}>
          <div className="feed-layout container">
              <p>
                <Link to={`/${title.slug}--${title._id}`}>
                  {title.name}
                </Link>
              </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Title;
