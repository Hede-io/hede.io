import React from 'react';

import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { Route, Switch } from 'react-router-dom';
import Wrapper from './Wrapper';
import Settings from './settings/Settings';
import ProfileSettings from './app/ProfileSettings';
import Activity from './activity/Activity';

//import Page from './feed/Page';
import PageHede from './feed/PageHede';
import SearchFeed from './feed/SearchFeed';

import Replies from './replies/Replies';

import User from './user/User';

import Tags from './tags/Tags';

import Bookmarks from './bookmarks/Bookmarks';

import About from './statics/About';
import Help from './statics/Help';
import Rules from './statics/Rules';
import Sponsors from './statics/Sponsors';
import Moderators from './statics/Moderators';
import WelcomeModerator from './statics/WelcomeModerator';
import PostShortlink from './statics/PostShortlink';
import BannedScreen from './statics/BannedScreen';

import Post from './post/Post';
import Write from './post/Write/Write';

import RequireLogin from './auth/RequireLogin';

import CookiePolicy from './statics/CookiePolicy';

export default (
  <Wrapper>
    <Switch>
      {<Route exact path="/" component={PageHede} />}
    
      <Route path="/cookies" exact component={CookiePolicy} />
      <Route
        path="/bookmarks"
        render={() => (
          <RequireLogin>
            <Bookmarks />
          </RequireLogin>
        )}
      />
      <Route
        exact
        path="/write"
        render={() => (
          <RequireLogin>
            <Write />
          </RequireLogin>
        )}
      />
   
     
      <Route
        exact
        path="/activity"
        render={() => (
          <RequireLogin>
            <Activity />
          </RequireLogin>
        )}
      />
      <Route
        exact
        path="/settings"
        render={() => (
          <RequireLogin>
            <Settings />
          </RequireLogin>
        )}
      />
      <Route
        exact
        path="/edit-profile"
        render={() => (
          <RequireLogin>
            <ProfileSettings />
          </RequireLogin>
        )}
      />
    
      <Route path="/@:name" component={User} />
      <Route path="/u/:postId" component={PostShortlink} />
      <Route path="/:category/@:author/:permlink" component={PageHede} />
      <Route path="/search/titles" component={PageHede} />
   
      <Route exact path="/:title" component={PageHede} />

    </Switch>
  </Wrapper>
);

export const history =
  typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();
