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
import Error404 from './statics/Error404';

class WriteLogin extends React.Component {
  render(){
    return <RequireLogin>
            <Write />
          </RequireLogin>;
  }
}

const routes = [
  {
    component: Wrapper,
    routes: [
      {
        path: '/',
        exact: true,
        component: PageHede,
      },
      {
        path: '/write',
        exact: true,
        component: WriteLogin,
      },
      /*{
        path: '/replies',
        exact: true,
        component: Replies,
      },
      {
        path: '/activity',
        exact: true,
        component: Activity,
      },
      {
        path: '/wallet',
        exact: true,
        component: Wallet,
      },
      {
        path: '/editor',
        component: Editor,
      },
      {
        path: '/settings',
        exact: true,
        component: Settings,
      },
      {
        path: '/edit-profile',
        exact: true,
        component: ProfileSettings,
      },
      {
        path: '/invite',
        exact: true,
        component: Invite,
      },
      {
        path: '/notifications',
        exact: true,
        component: Notifications,
      },*/
      {
        path: '/:title',
        component: PageHede,
        exact: true,
       
      },
      {
        path: '/@:name',
        component: User,
        exact: true,
       
      },
    
      {
        path: '/',
        exact: true,
        component: PageHede,
      },
      {
        path: '*',
        component: Error404,
      },
    ],
  },
];

export default routes;
