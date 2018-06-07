import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';


import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import urlParse from 'url-parse';

import {
  getIsAuthenticated,
  getAuthenticatedUser,
} from '../reducers';
import { getModerators } from '../actions/moderators';
import { moderatorAction } from '../actions/entry';
import Action from './Button/Action';
import { getUser, banUser, createUser } from '../actions/user'

import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

import './BanUser.less';


@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    moderators: state.moderators,
  }),
  { banUser, getUser, getModerators, createUser },
)
@injectIntl
class BanUser extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    username: PropTypes.string,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      showBanModal: false,
      banned: 0,
      banReason: "Violation of the Hede Rules",
      bannedUntil: new Date(0),
      bannedDays: 364000,
      nowdate: new Date(Date.now()),
    };

    this.changeDate = this.changeDate.bind(this);
    this.setReason = this.setReason.bind(this);
    this.doChangeDate = this.doChangeDate.bind(this);
  }

  componentDidMount () {
    const {moderators, getModerators, getUser, username, banUser, createUser } = this.props;
    if (username) {
      //console.log("banUser.js -> username: ", username);
    } else {
      //console.log("banUser.js - username is undefined!");
      return;
    }
    this.setState({nowdate: new Date(Date.now())});
    if (!moderators || !moderators.length) {
          getModerators();
    }
    
    getUser(username).then((res) => {
      const user = res.response;
      //console.log("banUser.js -> user: ", user);
      if (user && user.banned) {
        //console.log("user", user);
        if ((user.banned == 1) && (Date.parse(user.bannedUntil) > this.nowDate())) {
          //console.log("ban status: current");
          this.setState({banned: 1});
          this.setState({bannedUntil: user.bannedUntil});
          //console.log(" ==> ban-set completed");
        } else if (user.banned == 1) {
          //console.log("ban status: closing");
          var infDate = new Date(0);
          banUser(username, 0, user.bannedBy, "Temporal Ban Over", infDate);
          this.setState({banned: 0});
          this.setState({bannedUntil: infDate});
          //console.log(" ==> close completed");
        } else {
          //console.log("ban status: unbanned");
          this.setState({banned: 0});
          var infDate = new Date(0);
          this.setState({bannedUntil: infDate});
          //console.log(" ==> unban-set completed");
        }
      } else {
        //console.log("ban status: empty");
        this.setState({banned: 0});
        this.setState({bannedUntil: new Date(0)});
        //banUser(username, 0, "<hede-system>", "Ban Reason", new Date(0));
        //console.log(" ==> emptyset completed");
      }
      if (user && user.banReason && (user.banReason !== "<unknown>")) {
        this.setState({banReason: user.banReason});
      } else {
        this.setState({banReason: "Violation of the Hede Rules"});
      }
    });
  }

  handleClick = (e) => {

  };

//   componentDidMount() {
//     //   console.log(this.props.username);
//   }

  user () {
    const { getUser } = this.props;
    return getUser(this.props.username);
  }

  isPermitted () {
    const { moderators, authenticatedUser, username } = this.props;
    const check = find(propEq('account', authenticatedUser.name))(moderators);
    var first = false; var second = false;
    if (check && check.supermoderator && (check.supermoderator == true)) {
      first = true;
    } else {
      first = false;
    }
    const other = find(propEq('account', username))(moderators);
    if (other && other.supermoderator && (other.supermoderator == true)) {
      second = false;
    } else {
      second = true;
    }
    if (check && check.administrator && (check.administrator == true)) {
      first = true;
      second = true;
    }
    return (first && second);

  }

  startBanUser (banned) {
    const { banUser, username, authenticatedUser} = this.props;
    var reason = "<unknown>";
    if (banned == 1) reason = this.state.banReason;
    var whatDate = new Date(0);
    if (this.state.bannedUntil > (new Date(Date.now() + 10000))) {
      whatDate = new Date(this.state.bannedUntil);
      //console.log("Adding ban...", whatDate);
      banUser(username, banned, authenticatedUser.name, reason, whatDate);
    } else {
      if (banned == 0) {
        //console.log("Removing ban...");
        var infDate = new Date(0);
        whatDate = infDate;
        banUser(username, banned, authenticatedUser.name, reason, infDate);
      } else {
        //console.log("Adding perma-ban...");
        var forever = new Date(this.forever());
        whatDate = new Date(forever);
        banUser(username, banned, authenticatedUser.name, reason, forever);
      }
    }
       //console.log(`/BAN ${username} set to ${banned} until ${whatDate} by ${authenticatedUser.name} for ${reason}`);
  }

  bannedText () {
    if (this.state.banned == 0) {
      return (<span><b>not banned.</b><span> This means the user is allowed to take all normal actions on Hede.</span></span>);
    } else if (this.state.banned == 1) {
      return (<span><b>banned from posting.</b><span> This means the user will be unable to post contributions of any kind on Hede. </span></span>);
    }
    return (<span><em>not recorded in the database yet.</em></span>);
  }

  actionText () {
    if (this.state.banned == 0 ) {
      return (this.props.intl.formatMessage({
        id: 'banuser',
        defaultMessage: 'Ban User',
      }));
    } else {
      return (this.props.intl.formatMessage({
        id: 'unbanuser',
        defaultMessage: 'Unban User',
      }));
    }
  }
  okText(capitalize = true) {
    if (this.state.banned == 0) {
      if (!capitalize) return "ban";
      return "Ban";
    } else {
      if (!capitalize) return "unban";
      return "Unban";
    }
  }

  nowDate() {
    const x = this.state.nowdate;
    return x;
  }

  setReason(x) {
    this.setState({banReason: x});
  }

  changeDate(val) {
    //console.log("changing date selection...", val);
    this.setState({bannedDays: val});
    const curd = new Date(Date.now());
    const newD= curd.setDate(curd.getDate() + val);
    this.setState({bannedUntil: new Date(newD)});
    setTimeout(()=>{console.log("until ", new Date(this.state.bannedUntil))}, 500);
  }

  doChangeDate(e) {
    this.changeDate(parseInt(e.target.value));
  }

  forever() {
    return (this.nowDate().setFullYear(this.nowDate().getFullYear() + 999));
  }


  render() {
    if (this.isPermitted()) {
      return (
        <span>
    <Action
      negative={(this.state.banned === 0)}
      positive={(this.state.banned !== 0)}
      style={{ margin: '5px 0' }}
      text={this.actionText()}
      onClick={() => {
        this.setState({showBanModal: true});
        if (this.state.banned === 0) {
          this.setState({bannedDays: 364000});
        } else {
          this.setState({bannedUntil: new Date(Date.now())});
        }
        this.changeDate(364000);
      }}
    />
    <Modal
      visible={this.state.showBanModal}
      title={`${this.okText(true)} this user?`}
      okText={this.okText()}
      cancelText={'Cancel'}
      onCancel={() => this.setState({showBanModal: false})}
      onOk={ () => {
        var confirm = window.confirm("Are you sure you would like to " + this.okText(false) + " this user?")
        if (confirm) {
          var newstate = 1;
          if (this.state.banned == 0) {
            newstate = 1;
          } else {
            newstate = 0;
            this.setState({banReason: "Violation of the Hede Rules"});
          }
          this.startBanUser(newstate);
          this.setState({showBanModal: false}, () => {this.setState({banned: newstate});});
        }
      }}
    >
    <span>
    <p>This user is currently {this.bannedText()} <br/>Would you like to {this.okText(false)} this user?</p>
      {(this.state.banned == 1) && <span>The previous reason for banning was: <em className="prevReason">{this.state.banReason}</em></span>}
      {(this.state.banned == 0) &&
      <span>
        <br/><b>Banned Until:</b> <span id="dateSelectorDiv"><select id="dateSelector" onChange={this.doChangeDate} value={this.state.bannedDays} className="BanUser__select">
            <option value={364000}>Forever</option>
            <option value={0}>0 days</option>
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={5}>5 days</option>
            <option value={10}>10 days</option>
            <option value={20}>20 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
        </select></span>
        <br/><h4>Ban Reason:</h4><br/><center><textarea name="modInput" rows="5" cols="55" className="modInput" id="modInput" value={this.state.banReason} onChange={(e) => {this.setReason(e.target.value)}}/></center>


        </span>


      }

    </span>
    </Modal>


    </span>
      ); }
    else { return (
      <span>
            </span>
    );}
  }
}

export default BanUser;
