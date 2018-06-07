import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import StoryLoading from '../components/Story/StoryLoading';


import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import TopicSelector from '../components/TopicSelector';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

const PageHedeLoading = () =>
  (<div>
    <Helmet>
      <title>Hede - Knowledge Sharing Dictionary</title>
    </Helmet>
    <ScrollToTop />
    <ScrollToTopOnMount />
    <div className="shifted">
      <div className="feed-layout container">
         <div className="leftContainer">
               <div>
                <div className="left">
                </div>
              </div>
             </div>
        <Affix className="rightContainer" stickPosition={77}>
          <div className="right">
            
          </div>
        </Affix>
        <div className="center">
          <StoryLoading/>   
          <StoryLoading/>         
        </div>
      </div>
    </div>
  </div>);

export default PageHedeLoading;
