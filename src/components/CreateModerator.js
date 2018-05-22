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
import { getModerators, createModerator, removeModerator } from '../actions/moderators';
import { moderatorAction } from '../actions/entry';
import Action from './Button/Action';
import { getUser } from '../actions/user'

import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

import './CreateModerator.less';


@connect(
    state => ({
      authenticated: getIsAuthenticated(state),
      authenticatedUser: getAuthenticatedUser(state),
      moderators: state.moderators,
    }),
    {  getUser, getModerators, createModerator, removeModerator },
)
@injectIntl
class CreateModerator extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    username: PropTypes.shape().isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      showCreateModal: false,
      userIsMod: false,
      moderatorsDidLoad: false,
    };
  }

  componentDidMount () {
    const { getModerators, getUser, username, authenticatedUser, createModerator } = this.props;
    if (username) {
        //console.log("createModerator.js -> username: ", username);
    } else {
        return;
    }
    this.moderatorsLoad();
  }

  moderatorsLoad (force = false) {
    if ((this.state.moderatorsDidLoad == true) && (!force)) return;
    const {moderators, getModerators, username } = this.props;
    //console.log("username: ", username);
    const setMods = (mods) => {
      if (find(propEq('account', username))(mods)) {
        console.log("Viewed user is a Moderator.");
        this.setState({userIsMod: true});
      } else {
        //console.log("Viewed user is not a Moderator.");
        this.setState({userIsMod: false});
      }
      this.setState({moderatorsDidLoad: true});
    };

    if (!moderators || !moderators.length) {
      getModerators().then((res) => {
        setMods(res.response.results);
      });
    } else {
      setMods(moderators);
    }
  }

  componentWillMount() {
      this.moderatorsLoad();
  }

  handleClick = (e) => {

  };

//   componentDidMount() {
//     //   console.log(this.props.username);
//   }

  user () {
      const { getUser, username } = this.props;
      return getUser(username);
  }

  isPermitted () {
    const { moderators, authenticatedUser } = this.props;
    const check = find(propEq('account', authenticatedUser.name))(moderators);
    if (check && check.supermoderator && (check.supermoderator == true)) {
        return true;
    } else {
        return false;
    }
  }

  startCreateMod () {
      const { createModerator, getModerators, moderators, username, authenticatedUser} = this.props;
      if (!(username)) {
          console.log("CreateModerator: username is undefined");
      }
      createModerator(username, authenticatedUser.name).then((res) => {
        console.log("Moderator Created: ", username);
        this.moderatorsLoad(true);
      });
  }

  startDeleteMod () {
    const { removeModerator, getModerators, moderators, username, authenticatedUser} = this.props;
    const account = this.props.username;
    if (!(username)) {
        console.log("RemoveModerator: username is undefined");
    }
    removeModerator(username).then((res) => {
        console.log("Moderator Removed: ", username);
        this.moderatorsLoad(true);
    });

  }

  actionText () {
      this.moderatorsLoad();
      if (this.state.userIsMod === false) {
        return (this.props.intl.formatMessage({
            id: 'refermod',
            defaultMessage: 'Refer Moderator',
        }));
      } else {
        return (this.props.intl.formatMessage({
            id: 'removemod',
            defaultMessage: 'Remove Moderator',
        }));
      }
  }
    okText(capitalize = true) {
        this.moderatorsLoad();
        if (this.state.userIsMod === false) {
            if (!capitalize) return "refer";
            return "Refer";
        } else {
            if (!capitalize) return "remove";
            return "Remove";
        }
    }

    


  render() {
    if (this.isPermitted()) { 
        return (
      <span>
    <Action
            negative={(this.state.userIsMod === true)}
            deepblue={(this.state.userIsMod === false)}
            style={{ margin: '5px 0' }}
            text={this.actionText()}
            onClick={() => {
                this.setState({showCreateModal: true});
            }}
    />
    <Modal
              visible={this.state.showCreateModal}
              title={`${this.okText(true)} this user as a Moderator?`}
              okText={this.okText() + " Moderator"}
              cancelText={'Cancel'}
              onCancel={() => this.setState({showCreateModal: false})}
              onOk={ () => {
                  var confirmationString = "Are you sure you would like to " + this.okText(false) + " this user as a moderator?";
                  if (this.state.userIsMod == false) {
                      confirmationString += " Remember that you will need to mentor and keep track of this new moderator's progress along the way.";
                  } else {
                      confirmationString += " Only take this action if this moderator has been behaving completely erratically. You must talk with fellow moderators and contact this person before removing their moderatorship.";
                  }
                  var confirm = window.confirm(confirmationString);
                  if (confirm) {
                      if (this.state.userIsMod == false) {this.startCreateMod();}
                      else if (this.state.userIsMod == true) {this.startDeleteMod();}
                      this.setState({showCreateModal: false});
                  }
              }}
            ><span>
    
    { this.state.userIsMod == false &&
    <span>Referring a moderator means that you fully trust the user with the responsibilities and necessities of being a Hede Moderator.<br/>

    Additonally, as the referrer of the new moderator, you will be held accountable for the new moderator. <br/>
    You will need to make sure the new moderator understands and follows the <a href="https://hede.io/welcome-moderator">Moderator Guidelines</a> and <a href="https://hede.io/rules">Hede Rules.</a><br/>
    You will need to check in with the new moderator and make sure they're effectively moderating.<br/><br/>

    It is recommended to refer users who you <b> know personally,</b> so you can easily contact them if necessary.<br/>
    Furthermore, it is encouraged to refer users who have been actively contributing to Hede and who have been following the Rules well.

    To refer this user as a Hede Moderator, click the button below.
        
    </span>}
    { this.state.userIsMod == true &&
    <span>Removing moderatorship is a very intensive action and should only be taken in dire circumstances.<br/>

    You should only do this after contacting the misbehaving moderator about their behavior, and discussing with other fellow moderators.<br/><br/>
    
    If you still want to remove this moderator's permissions, click the button below.
    </span>}
        
        
    </span></Modal>      
    </span>
    ); }
    else { return (
        <span>
            </span>
    );}
  }
}

export default CreateModerator;
