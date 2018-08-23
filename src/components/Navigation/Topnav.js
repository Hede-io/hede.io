import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Menu from 'antd/lib/menu';
import Popover from 'antd/lib/popover';
import Tooltip from 'antd/lib/tooltip';
import Input from 'antd/lib/input';
import Badge from 'antd/lib/badge';
import Select from 'antd/lib/select';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';

import AutoComplete from 'antd/lib/auto-complete';

import Action from '../Button/Action';

import sc2 from '../../sc2';

import Icon from 'antd/lib/icon';
import Autocomplete from 'react-autocomplete';
import Avatar from '../Avatar';
import Notifications from './Notifications/Notifications';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { searchTitles } from '../../actions/titles';
import {setLeftTitlesVisible} from "../../actions/ui";
import Cookie from 'js-cookie';

import './Topnav.less';

const InputGroup = Input.Group;
const Option = Select.Option;

const AOption = AutoComplete.Option;

 
@connect(
  state => ({
    titlesFound : state.titlesFound,
//    leftTitlesVisible: state.leftTitlesVisible

  }),
  {
    searchTitles,
    setLeftTitlesVisible
   },
)
class Topnav extends React.Component {

  state = {
    value: '',
    loading: false,
    loaded: false,
    searchSection: 'titles',
    visible: false,
    searchQuery:''
  };

  static propTypes = {
    titlesFound: PropTypes.arrayOf(PropTypes.shape()).isRequired
  }
  static defaultProps = {
    titlesFound : []
  }

  

  inValidPaths(x) {
    const validPaths = [
      'titles,',
      ''
    ]
    return validPaths.includes(x);
  }

  constructor (props) {
    super(props)
    this.renderItems = this.renderItems.bind(this);
    this.searchQuery = "";
  }

  renderItems(items) {
    return items;
  }

  shortLong(shorter, longer) {
    const size = window.innerWidth;
    if (size <= 736) {
      return shorter;
    } 
    return longer;
  }

  newEntryWord() {
    if (window.innerWidth <= 736) {
      return <span>&nbsp;</span>;
    } else {
      return "New Topic";
    }
  }

  onSearchQueryChange = (v) => {
    if(v.indexOf("İ")>-1)
      v = v.replace("İ", "i");
      
    this.setState({searchQuery : v.toLocaleLowerCase('en-US')});

  }

  renderSearch () {
    const { history, location } = this.props;

    const { titlesFound } = this.props;

    let toAdd = null;
    let toShow = null;
    
    let sQ = this.state.searchQuery && this.state.searchQuery.replace("show:", "").replace("search:", "");

    if(sQ && sQ.length > 0)
      toShow = {s: 'show:' + sQ, name: sQ};

    let optionsToRender = toShow ? [toShow, ...titlesFound] : titlesFound;

    if(sQ && sQ.length > 2)
      toAdd = {q: 'search:' + sQ, name: sQ}

    optionsToRender = toAdd? [...optionsToRender, toAdd]: optionsToRender;

    return (
      <div className="Search SearchSelector">

        <InputGroup className="SearchSelector" compact>

          <AutoComplete
            className="autocomplete"
            size="large"
            style={{ width: '100%', height: 56 }}
            dataSource={optionsToRender.map(this.renderOption)}
            onSelect={this.onSelect}
            onSearch={this.handleSearch}
            onChange = {(v) => this.onSearchQueryChange(v)}
            placeholder=""
            optionLabelProp="text"
            value = {this.state.searchQuery.replace("show:", "").replace("search:", "")}

          >

              
            <Input
              ref={input => this.searchInput = input}
              placeholder="Search or start a topic"
              onKeyPress={(event) => {
                const q = event.target.value;
                const searchSection = this.state.searchSection;

                if (event.key === 'Enter') {
                  history.push(`/?q=${q}`);
                }
              }}
              className="searchBar"
              suffix={(
                <Button className="search-btn" size="large" type="primary">
                  <Icon type="search" />
                </Button>
              )}
            
            />
          </AutoComplete>
        </InputGroup>


      </div>
    )}

    showModal = () => {
      this.setState({
        visible: true,
      });
      setTimeout(() => {
        const { visible, loading } = this.state;
        if(visible){
          window.location.href=sc2.getLoginUrl(window !== null && window.location!==null && window.location.pathname.length > 1 ? window.location.pathname : '');
          this.setState({ loading: false, visible: false });}
      }, 6000);
    }
  
    handleOk = () => {
      this.setState({ loading: true });
      window.location.href=sc2.getLoginUrl(window !== null && window.location!==null && window.location.pathname.length > 1 ? window.location.pathname : '');
    }
  
    handleCancel = () => {
      this.setState({ visible: false });
    }


    onSelect = (value) =>{
      if(value.startsWith('search:'))
        this.props.history.push(`/search/titles?q=${value.substring(7)}`);
      else if(value.startsWith('show:'))
        this.props.history.push(`/?q=${value.substring(5)}`);
      else
        this.props.history.push(`/${value}`);

        //this.setState({searchQuery: this.state.searchQuery.replace("show:", "").replace("search:", "")});
    }

    renderOption = (item) =>{
      return (
        <AOption key={item.q?item.q : (item.s? item.s : (item.slug + '--' + item._id))} text={item.name}>
          {item.q?'Search: ':(item.s?'Show: ':'')}{item.name} {item.total ? '('+item.total+')': ''}
        </AOption>
      );
    }


  handleSearch = (value) => {

    
    if (value.length >= 3){
      this.props.searchTitles({
        limit: 5,
        skip: 0,
        section: 'all',
        sortBy: 'created',
        type: 'search',
        bySimilarity: value,
        reset: true,
      }).then(res => {
        this.total = res.response.total;
      }); 
    }
    /*
    this.setState({
      dataSource: value ? this.searchResult(value) : [],
    });*/
  }

      
  render() {
    const {
      intl,
      username,
      onNotificationClick,
      onSeeAllClick,
      onMenuItemClick,
      notifications,
      history,
    } = this.props;

    let content;

    const notificationsCount =
      notifications && notifications.filter(notification => !notification.read).length;

    const next = window !== null && window.location!==undefined && window.location.pathname.length > 1 ? window.location.pathname : '';

    const {visible, loading} = this.state
    //const title = new URLSearchParams(this.props.location).get('t');

    let title = null

    if(this.props.location){
      if(this.props.location.pathname.indexOf('--')>-1)
        title = this.props.location.pathname.substring(1)
    
    }

    //console.log("topnav title: ", title)

    const newEntryLocation = "/write" + (title?"?t="+encodeURIComponent(title):"")
    //console.log("new entry locaion: ", newEntryLocation)


    if (username) {
      content = (
        <div className="Topnav__menu-container">
          <Menu selectedKeys={[]} className="Topnav__menu-container__menu" mode="horizontal">
           
            <Menu.Item key="write" className="Topnav__item-write-new nobottom">
             
              {/*<Action primary={true} cozy={true} style={{ margin: '0px 5px', 'min-width':'40px' }} 
              text={
                  <span style={{textDecoration: "none"}}><i className="iconfont icon-add"/> <span className="Topnav__newReport_text">{this.newEntryWord()}</span></span>
            
              }
              onClick={() => {this.props.history.push(newEntryLocation)}}
            />*/}
            </Menu.Item>
            <Menu.Item key="user" className="Topnav__item-user">
              <Link className="Topnav__user" to={`/@${username}`}>
                <Avatar username={username} size={36}/>
              
              </Link>
            </Menu.Item>
            <Menu.Item className="UWhite" key="more">
              <Popover
                className="TopPopover"
                placement="bottom"
                trigger="click"
                content={
                  <PopoverMenu key="mainMenu" onSelect={onMenuItemClick} className="TopPopover TopRightPopover">
                    <PopoverMenuItem key="settings">
                      Settings
                    </PopoverMenuItem>
                    <PopoverMenuItem key="logout">
                      Logout
                    </PopoverMenuItem>
                  </PopoverMenu>
                }
              >
                <a className="Topnav__whitelink Topnav__whitelink--light">
                  <i className="iconfont icon-switch"/>
                </a>
              </Popover>
            </Menu.Item>
          </Menu>
        </div>
      );
    } else {
      content = (
        <div className="Topnav__menu-container">
          <Menu className="Topnav__menu-container__menu" mode="horizontal">
          
            <Menu.Item key="signup" className="UWhite">
              <a onClick={()=>{          if (window.ga){ {window.ga('send', 'event', 'outbound', 'click', 'https://steemit.com/pick_account',{'transport': 'beacon','hitCallback': function(){document.location = 'https://steemit.com/pick_account'; return false;}});}} else{document.location = 'https://steemit.com/pick_account';}}} rel="noopener" className="UWhite" href="https://steemit.com/pick_account">
                <FormattedMessage id="signup" className="UWhite" defaultMessage="Sign up"/>
              </a>
            </Menu.Item>
            <Menu.Item key="divider" className="UWhite" disabled>
              |
            </Menu.Item>
            <Menu.Item className="UWhite" key="login">
             <span onClick={this.showModal} className="UWhite">
                <FormattedMessage id="login" className="UWhite" defaultMessage="Log in"/>
              </span>
            </Menu.Item>

             <Modal
            visible={visible}
            title="Logging in..."
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
              <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                Proceed
              </Button>,
            ]}
          >
            You are now being redirected to SteemConnect to authorise your STEEM session.
            <br/>
            For your safety double check that the url starts with https://v2.steemconnect.com/
            <br/>
            <small>Hede.io will never access your private keys.</small>
          </Modal>

          </Menu>
        </div>
      );
    }
    const mainPage = "/" + Cookie.get("language2") ? `?l=${Cookie.get("language2")}` : "";

    return (
      <div>
        <div className="Topnav">
          <div className="topnav-layout container">
            <div className="left">
             <Link to="/" style={{ margin: '0px 5px', 'width':'60px' }}>
               
                  <span style={{textDecoration: "none"}}><i style={{color:'#ffffff'}} className="iconfont icon-createtask"/></span>
                
              </Link>
              <Link className="Topnav__brand" to={mainPage}>
                <img src="https://hede.io/img/HedeLogo.png"/>
              </Link>
              <span className="Topnav__version"><Link to="/" className="Topnav__version">{window.innerWidth > 736 && <span>&nbsp;&nbsp;</span>}beta</Link></span>
            </div>
            <div className="center">
              <div className="Topnav__input-container nomobile">
                { this.renderSearch() }
              </div>
            </div>
            <div className="right">
              {content}
            </div>
          </div>
        </div>
        <div className="Searchmobile yesmobile">
          { this.renderSearch() }
        </div>
      </div>
    );
  }
}

Topnav.propTypes = {
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string,
  onNotificationClick: PropTypes.func,
  onSeeAllClick: PropTypes.func,
  onMenuItemClick: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
  history: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,

};

Topnav.defaultProps = {
  username: undefined,
  onNotificationClick: () => {},
  onSeeAllClick: () => {},
  onMenuItemClick: () => {},
  notifications: [],
  location: undefined
};

export default injectIntl(Topnav);
