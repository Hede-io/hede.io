import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import Layout from 'antd/lib/layout';
import Cookie from 'js-cookie';
import Loading from './components/Icon/Loading';

import { getIsUserFetching, getAuthenticatedUser, getLocale, getIsAuthFetching, getIsLoaded, getIsAuthenticated } from './reducers';
import { getUser } from './actions/user';

import { login, logout } from './auth/authActions';
import { getRate, getRewardFund, getTrendingTopics, getCurrentMedianHistoryPrice } from './app/appActions';
import Topnav from './components/Navigation/Topnav';
import CookiePolicyBanner from './statics/CookiePolicyBanner';
import Transfer from './wallet/Transfer';
import * as reblogActions from './app/Reblog/reblogActions';
import getTranslations, { getAvailableLocale } from './translations';
import PageHedeLoading from './feed/PageHedeLoading'

@withRouter
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    isAuthFetching: getIsAuthFetching(state),
    loaded: getIsLoaded(state),
    locale: getLocale(state),
    isAuth: getIsAuthenticated(state),
    isUserFetching: getIsUserFetching(state)
  }),
  {
    login,
    logout,
   /* getRate,
    getRewardFund,
    getTrendingTopics,
    getCurrentMedianHistoryPrice,
    getRebloggedList: reblogActions.getRebloggedList,*/
    getUser,
  },
)
export default class Wrapper extends React.PureComponent {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    history: PropTypes.shape().isRequired,
    login: PropTypes.func,
    logout: PropTypes.func,
    /*getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getRewardFund: PropTypes.func,
    getTrendingTopics: PropTypes.func,
    getCurrentMedianHistoryPrice: PropTypes.func,*/
  };

  static defaultProps = {
    login: () => {},
    logout: () => {},
    /*getRebloggedList: () => {},
    getRate: () => {},
    getRewardFund: () => {},
    getTrendingTopics: () => {},
    getCurrentMedianHistoryPrice: () => {},*/
  };

  state = {
   loadedUser: false,
   loadedGuest: false
  };

  componentWillMount() {
    if (Cookie.get('session')) {
      this.props.login();
    }else{
      this.setState({loadedGuest: true})
      //console.log("loaded guest")

    }
    /*this.props.getRewardFund();
    this.props.getRebloggedList();
    this.props.getRate();
    this.props.getTrendingTopics();
    this.props.getCurrentMedianHistoryPrice();*/
  }

  componentDidUpdate () {
    const { user, getUser, loaded, isAuthFetching, isAuth, isUserFetching } = this.props;

    if (user && user.name && !this.state.loadedUser && !isAuthFetching && !isUserFetching) {
      getUser(user.name).then(res => {
        this.setState({loadedUser: true})
        //console.log("loaded user ")

      });
    }

    if(!isAuthFetching && loaded && !isAuth){
      //console.log("there was an error while logging in. so clearing cookie")
      Cookie.remove('session');
      this.setState({loadedGuest: true});
    }
    //console.log("wrapper props:", this.props)
  }

  handleMenuItemClick = (key) => {
    switch (key) {
      case 'logout':
        this.props.logout();
        break;
      case 'entry':
        this.props.history.push('/write');
        break;
      case 'activity':
        window.open(`https://steemd.com/@${this.props.user.name}`);
        break;
      case 'replies':
        window.open(`https://steemit.com/@${this.props.user.name}/recent-replies`);
        break;
      case 'bookmarks':
        this.props.history.push('/bookmarks');
        break;
      case 'settings':
        this.props.history.push('/settings');
        break;
      default:
        break;
    }
  };

  render() {
    const { locale: appLocale, user, location } = this.props;

    const locale = getAvailableLocale(appLocale);
    const translations = getTranslations(appLocale);

    return (
      <IntlProvider key={locale} locale={locale} messages={translations}>
        <Layout>
          <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 5 }}>
            <Topnav
              username={user.name}
              onMenuItemClick={this.handleMenuItemClick}
              history={this.props.history}
              location={{pathname:location.pathname, search:location.search}}
            />
          </Layout.Header>
          
            <div className="content">
              {(this.state.loadedUser || this.state.loadedGuest) &&

               this.props.children
             }
              <Transfer />
            </div>
          

          {!(this.state.loadedUser || this.state.loadedGuest) &&
            <div style={{marginTop:50}}>
              <PageHedeLoading/>
             </div>
          }
          <CookiePolicyBanner />
        </Layout>
      </IntlProvider>
    );
  }
}
