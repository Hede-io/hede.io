import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from '../actions/constants';
import { Link } from 'react-router-dom';
import Feed from './Feed';
import EmptyFeed from '../statics/EmptyFeed';
import ScrollToTop from '../components/Utils/ScrollToTop';
import {Redirect} from 'react-router-dom';
import { getIsAuthenticated, getAuthenticatedUser } from '../reducers';

import { getEntries } from '../actions/entries';
import { getModerators } from '../actions/moderators';
import Tabs from 'antd/lib/tabs';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Pagination from 'antd/lib/pagination';

import MdCreate from 'react-icons/lib/md/create';

import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

import './EntryFeed.less';
import Write from '../post/Write/Write'
import BannedScreen from '../statics/BannedScreen';

import { Helmet } from 'react-helmet';
import {removeHedeReference2 } from '../helpers/regexHelpers';
import Cookie from 'js-cookie';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
    entries: state.entries,
    loading: state.loading,
    moderators: state.moderators,
    currentTitle: state.currentTitle,
  }),
  {
    getEntries,
    getModerators
  },
)
class EntryFeed extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    moderators: PropTypes.array,
    reset: PropTypes.bool.isRequired,
  };

  state = {
    skip: 0,
  };

  static defaultProps={
    reset: true,
    currentTitle: null
  }
  constructor(props) {
    super(props);
    this.loadResults = this.loadResults.bind(this);
    this.total = 0;
    this.redirectId = 0;
    this.loadMoreEnabled = true;
    this.titleId = 0;
    this.titleSlug = '';
    this.q = null;
    this.l = '';
    this.h = '';
    this.c = '';
    this.p = 1;
    this.shouldRedirectToMain = false;

    //this.toRenderEntries = [];
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
    if (!this.props || !this.props.moderators) return false;
    const { moderators, user } = this.props;
    return find(propEq('account', user.name))(moderators)
  }

  onLoadMoreClick = () => {
    this.loadMoreEnabled = true;
    this.setState({loadMoreClick: true});
  }
  
  setPage = (page, pageSize) => {
    //console.log("current Page:", page);

    const qsParams = new URLSearchParams(this.props.location.search);

    qsParams.set("p", page);
    this.props.history.push({
      pathname: location.pathname,
      search: '?'+ qsParams.toString()
    });
  }

  onPageChange = (page, pageSize) => {
    const { getEntries} = this.props;

    this.currentPage = page;


    getEntries({
      limit: pageSize,
      skip: (page-1) * pageSize,
      section: 'title',
      sortBy: 'created',
      type: 'all',
      titleSlug: this.titleSlug,
      titleId: this.titleId,
      q: this.q,
      reset: true,
      section: 'title',
      l: this.l,
      sortDirection: this.o,
      h: this.h,
      c: this.c
    }).then(res => {
    
      //this.toRenderEntries = [...this.toRenderEntries, ...res.response.results];

      this.total = res.response.total;
      //console.log("my total:", this.total)
      //this.setState({skip: skip + limit, loadMoreClick: false});
    });
  }

  loadResults (nextProps = false) {

    if(!nextProps && !this.loadMoreEnabled)
      return;
    
    this.loadMoreEnabled = false;

    const { match, getEntries, user, history, location:{search}} = nextProps || this.props;
    const qsParams = new URLSearchParams(search);
    this.q = qsParams.get('q');
    this.q = this.q ? this.q.trim().replace("İ", "i").toLowerCase():null;
    this.l = qsParams.get('l');
    this.h = qsParams.get('h');
    this.c = qsParams.get('c');

    /*Override language setting with url (commented out temporarily)
    const currentLang = Cookie.get("language2");
    if(this.l && typeof this.l !== "undefined" && currentLang !== this.l)
      Cookie.set("language2", this.l);
    */

    this.o = qsParams.get('o') || 'a';

    this.p = (Number(qsParams.get('p')) || 1);

    //console.log("language", l);
    //console.log("q", this.q);

    const limit = 25;

    const skip = (this.p-1) * limit;

    const tt = match.params.title;
    const searchSection = match.params.searchSection;
    //const skip =  nextProps ? 0 : this.state.skip;
    this.total = 0;//nextProps ? 0 : this.total;

    //this.toRenderEntries = nextProps ? [] : this.toRenderEntries;


    /*if(
      (!this.q || (this.q && this.q.length==0)) && 
      (!tt || (tt && tt.length==0))
    ){
      window.location.href = '/?q=hede';
    }*/

    if(tt && !this.q){
        let titleArray = tt.split('--')
        this.titleSlug = titleArray.length>0?titleArray[0]:''
        this.titleId = titleArray.length>1?titleArray[titleArray.length-1]:0
    }

    if(
      (!this.q || (this.q && this.q.length==0)) && 
      (!tt || (tt && tt.length==0)) && window.innerWidth > 736
    ){
      this.shouldRedirectToMain = true;
    }else
      this.shouldRedirectToMain = false;

    if (this.total !== 0 && this.total <= this.state.skip) {
      return;
    }

//limit=20&skip=0&section=title&sortBy=created&type=all&title=hede&reset=true&section=title
    getEntries({
        limit,
        skip,
        section: 'title',
        sortBy: 'created',
        type: 'all',
        titleSlug: this.titleSlug,
        titleId: this.titleId,
        q: this.q,
        reset: true,
        section: 'title',
        l: this.l,
        sortDirection: this.o,
        h: this.h,
        c: this.c
    }).then(res => {
        if(res.response.redirect){
            history.push("/" + res.response.redirect)
            return
        }

        //this.toRenderEntries = [...this.toRenderEntries, ...res.response.results];

        this.total = res.response.total;
        //console.log("my total:", this.total)
        this.setState({skip: skip + limit, loadMoreClick: false});
    });
    
  }

  renderResults () {
    const { entries, match, user } = this.props;
    const { searchSection } = match.params;

    return entries;
  }


  componentWillReceiveProps (nextProps) {
    const { location } = this.props;

    if (location.pathname !== nextProps.location.pathname || location.search !== nextProps.location.search) {
      this.total = 0; // @TODO antipattern - requires better implementation
      //this.toRenderEntries = [];
      this.loadResults(nextProps);
    }
  }


  render() {
    const tt = this.props.match.params.title;
    if(
      this.shouldRedirectToMain && tt !== "hede-io--1"
    ){
      //console.log("redirecting to hede.io because title is empty. q:", this.q, ", title:", tt);
      return <Redirect from='/' to='/hede-io--1?l=en'/>
    }

    const { loading, history, match, location, isModerator, currentTitle } = this.props;
    const { searchSection } = match.params;
    const isFetching = loading === Actions.GET_ENTRIES_REQUEST;

    const results = this.props.entries;
    const hasMore = this.total > results.length;
    const newEntryLocation = "/write" + (currentTitle?"?t="+encodeURIComponent(currentTitle.slug+"--" + currentTitle._id):"")

    const currentTitleUrl = currentTitle ? ("/"+encodeURIComponent(currentTitle.slug+"--" + currentTitle._id)):"";
    const myTitle = this.q!==null?this.q: (currentTitle? currentTitle.name:"");

    const canonicalHost = 'https://hede.io';
    const canonicalUrl = `${canonicalHost}${currentTitleUrl}`;

    let desc = results?results.length>0?results[0].body:"":"";
    desc = desc.replace(removeHedeReference2, "").replace(/<br\s?\/\>\s*$/, "");


//  languages : ["en", "ar", "id", "zh", "de", "fr", "it", "kr", "pt", "ru", "es", "th", "tr"],

    return (
      <div>
        <Helmet>
          <title>{currentTitle && typeof currentTitle !=='undefined' && typeof currentTitle.name !== "undefined" && currentTitle.name !== "undefined"? currentTitle.name + " | ":""}Wiki | Hede</title>

            <link rel="canonical" href={canonicalUrl} />
            <meta property="description" content={desc} />
            <meta property="og:title" content={myTitle} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:description" content={desc} />
            <meta property="og:site_name" content="Hede" />
            <link rel="alternate" hreflang="tr" href={canonicalUrl+"?l=tr"}/>
            <link rel="alternate" hreflang="en" href={canonicalUrl+"?l=en"}/>
            <link rel="alternate" hreflang="es" href={canonicalUrl+"?l=es"}/>

            {/*<link rel="alternate" hreflang="fr" href={canonicalUrl+"?l=fr"}/>
            <link rel="alternate" hreflang="de" href={canonicalUrl+"?l=de"}/>
            <link rel="alternate" hreflang="it" href={canonicalUrl+"?l=it"}/>
            <link rel="alternate" hreflang="ar" href={canonicalUrl+"?l=ar"}/>
            <link rel="alternate" hreflang="id" href={canonicalUrl+"?l=id"}/>
            <link rel="alternate" hreflang="zh" href={canonicalUrl+"?l=zh"}/>
            <link rel="alternate" hreflang="kr" href={canonicalUrl+"?l=kr"}/>
            <link rel="alternate" hreflang="pt" href={canonicalUrl+"?l=pt"}/>
            <link rel="alternate" hreflang="ru" href={canonicalUrl+"?l=ru"}/>
           <link rel="alternate" hreflang="th" href={canonicalUrl+"?l=th"}/>*/}
            <meta property="twitter:site" content={'@hede-io'} />
            <meta property="twitter:title" content={myTitle} />
            <meta property="twitter:description" content={desc} />
            <meta
              property="twitter:image"
              content={'https://hede.io/img/hede_thumbnail2.png'}
            />

        </Helmet>
        <ScrollToTop />

        <h1 style={{flex:1, fontWeight: 'bold', fontSize:24, marginLeft:20}}><a href={canonicalUrl} style={{color:'#323233'}}>{myTitle}</a></h1>
         
         {/*this.props.user && this.props.authenticated && !this.props.user.banned && this.q === null && 
           <div className="EntryFeed" style={{marginBottom: 12}}>
          
       <Button className="EntryFeed__writeEntryButton" onClick = {()=>{window.scrollTo(0,document.body.scrollHeight);     document.getElementById("entryInput").focus();}}> <MdCreate style={{verticalAlign:'middle'}}/> ADD NEW ENTRY</Button>}
          </div>

      */}
        
        
        <Feed
            content={ results }
            isFetching={ isFetching }
            hasMore={ this.loadMoreEnabled  }
            loadMoreContent={ this.loadResults }
            
          /> 

        {/*hasMore &&
          <Button style={{marginBottom:5, flex:1, width:"100%"}} onClick={this.onLoadMoreClick}>Load More</Button>
        */}

        {results.length<=0 && !isFetching && <EmptyFeed
          text={'No entries have been found. Write the first entry to start the topic'}
        />}

        {results.length>0 &&
          <Pagination className="EntryFeed__pagination" defaultCurrent={1} current={this.p} total={this.total} onChange={this.setPage} pageSize={25} />
        }
        
        {this.props.user && this.props.authenticated && !this.props.user.banned!==1 && 

           <Write title={this.props.currentTitle}/>
        }

        {this.props.user && this.props.authenticated && this.props.user.banned===1 &&
              <BannedScreen redirector={false}/>

        }
    
      </div>
    );
  }
}

export default EntryFeed;