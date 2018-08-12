import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch} from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { getIsAuthenticated } from '../reducers';


import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import TopicSelector from '../components/TopicSelector';
import Post from '../post/Post';

import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import EntryFeed from './EntryFeed'
import {getLeftTitles} from "../actions/titles";
import {setLeftTitlesVisible} from "../actions/ui";
import { getEntries } from '../actions/entries';
import { getEntry, setEntry } from '../actions/entry';
import Cookie from 'js-cookie';

import SearchFeed from './SearchFeed';
/*
window.redirectToTitle = function(t){
  console.log("js run"); 
  window.history.pushState({urlPath:encodeURIComponent(t)},"","/?q="+encodeURIComponent(t));
  return false;
}*/

const getEntriesFirstTime = (match, req) =>{
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    let qsParams = {},
    matchRegex;
    while (matchRegex = regex.exec(req.url)) {
      qsParams[matchRegex[1]] = matchRegex[2];
    }

    const q = qsParams['q'];
    const l = qsParams['l'];
    const h = qsParams['h'];
    const c = qsParams['c'];
    const tt = match.params.title;

    const o = qsParams['o'] || 'a';

    const p = (Number(qsParams['p']) || 1);
    const limit = 25;

    const skip = (p-1) * limit;

    let titleSlug = "", titleId = 0;
    if(tt && !q){
      let titleArray = tt.split('--')
      titleSlug = titleArray.length>0?titleArray[0]:''
      titleId = titleArray.length>1?titleArray[titleArray.length-1]:0
    }

  return getEntries({
    limit,
    skip,
    section: 'title',
    sortBy: 'created',
    type: 'all',
    titleSlug: titleSlug,
    titleId: titleId,
    q,
    reset: true,
    section: 'title',
    l,
    sortDirection: o,
    h,
    c
  });
}


@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    leftTitlesVisible: state.leftTitlesVisible,
    titles: state.leftTitles,
  }),{
    getLeftTitles,
  }
)
class PageHede extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTitle: 'hede',
    };
    this.leftTitlesVisible = 0;
  }

  static needs({ store, match, req }) {
    if(match.path === "/search/titles")
      return [];

    if(match.path === "/:category/@:author/:permlink"){
      return [store.dispatch(getEntry(match.params.author, match.params.permlink))];
    }
    
    
    return [store.dispatch(getEntriesFirstTime(match, req))];
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    const title = pathname.split('/')[1];

    if(window.innerWidth <= 736){
      /*if (pathname !== this.props.location.pathname || nextProps.location.search !== this.props.location.search){
        window.leftTitlesVisible = -1;
      }*/
      if(nextProps.location.pathname === '/' && nextProps.location.search===''){
            //console.log("lefttitlesvisible set to true 1")
            window.leftTitlesVisible = 1;
      }else{
            window.leftTitlesVisible = -1;
            //console.log("lefttitlesvisible set to false 2")

          
      }
    }

  }

  componentWillMount(){

    if(window.innerWidth <= 736){
     
      if(this.props.location.pathname === '/' && this.props.location.search===''){
        //console.log("lefttitlesvisible set to true 3")

          window.leftTitlesVisible = 1;
      }else{
         //console.log("lefttitlesvisible set to false 4")

          window.leftTitlesVisible = -1;
      }
  
      
    }
  }

  getLastTitles = ()=>{
    var lang = typeof navigator!=="undefined"?(navigator.language || navigator.userLanguage):"all";
    let filterLanguage = "all";

    if(Cookie.get("language2"))
      filterLanguage = Cookie.get("language2");
    else{
      if(lang.startsWith("tr-"))
        filterLanguage = "tr";
      else if(lang.startsWith("es-"))
        filterLanguage = "es";
      else if(lang.startsWith("az-"))
        filterLanguage = "az";
      else
        filterLanguage = "en";
    }
    
    this.props.getLeftTitles({
      limit:50,
      skip:0,
      section: 'all',
      sortBy: 'created',
      type: 'all',
      reset: true,
      l: filterLanguage || 'all',
      tag:"tag1,tag2",
    }).then(res=>{
      /*this.total = res.response.total;
      this.setState({skip: skip + limit});*/
    });
  }
  
  componentDidMount(){
      this.getLastTitles();
  }

  handleTitleChange = (title) => {
    this.setState({
      currentTitle: title,
    }, () => {
        this.props.history.push(`/${title}`);
      
    });
  };

  handleTopicClose = () => this.props.history.push(`${this.props.match.url}trending`);

  render() {
    const { authenticated, match, location, history } = this.props;
    const shouldDisplaySelector = location.pathname !== '/' || !authenticated;
    //console.log("hede render called", ", location:", location, ", history:", history, "leftTitlesVisible:", window.leftTitlesVisible)

    const style1 = window.leftTitlesVisible<0?{display: 'none'}:{};
    const style2 = window.leftTitlesVisible>0?{display: 'none'}:{};

    return (
      <div>
        <Helmet>
          <title>HEDE</title>
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="feed-layout container">
              <div className="leftContainer" style={style1}>
               <div className="leftTitles">
                <div className="left">
                  <LeftSidebar />
                </div>
              </div>
             </div>
             {typeof document !== "undefined" &&

                <Affix className="rightContainer" stickPosition={77}>
                  <div className="right">
                    <RightSidebar match={match} isTitle={true} location={{pathname:location.pathname, search:location.search}} history={history}/>
                  </div>
                </Affix>
             }
            <div className="center"  style={style2}>
            <Switch>

              <Route path="/search/titles" component={ SearchFeed }/>
              <Route path="/:category/@:author/:permlink" component={Post} />

              <Route path={`${match.path}`} component={ EntryFeed } reset={false} />

            </Switch>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageHede;
