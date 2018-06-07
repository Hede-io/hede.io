import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from 'antd/lib/modal';


import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import get from 'lodash/get';
import urlParse from 'url-parse';
import querystring from 'querystring';

import {
  getUser,
  getIsAuthenticated,
  getAuthenticatedUser,
} from '../../reducers';


import { openTransfer } from '../../wallet/walletActions';
import Action from '../../components/Button/Action';
import BanUser from '../../components/BanUser';
import CreateModerator from '../../components/CreateModerator';

const UserInfo = ({ intl, authenticated, authenticatedUser, user, ...props }) => {
  const location = user && get(user.json_metadata, 'profile.location');
  let website = user && get(user.json_metadata, 'profile.website');
  let showBanModal = false;
  if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
    website = `http://${website}`;
  }
  const url = urlParse(website);
  let hostWithoutWWW = url.host;

  if (hostWithoutWWW.indexOf('www.') === 0) {
    hostWithoutWWW = hostWithoutWWW.slice(4);
  }

  const isSameUser = authenticated && authenticatedUser.name === user.name;

  const websiteFormat = () => {
    const deft = `${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`;
    if ((deft).length > 12) {
        var    a      = document.createElement('a');
               a.href = url;
        const hn = `${a.hostname}/...`;
        if ((hn).length < 15) return hn;
        return "Website";
    }
    return deft;
  }

  const currentUsername = () => {
    if (user && user.name) return (user.name);
    var atName = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
    return atName.replace("@", "");
  }

  return (<div>
    {user.name &&
      <div style={{ wordBreak: 'break-word' }}>
        {get(user && user.json_metadata, 'profile.about')}
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          {location && <div>
            <i className="iconfont icon-coordinates text-icon" />
            {location}
          </div>}
          {website && <div>
            <i className="iconfont icon-link text-icon" />
            <a target="_blank" rel="noopener noreferrer" href={website}>
              {websiteFormat()}
            </a>
          </div>}
          <div>
            <i className="iconfont icon-time text-icon" />
            <FormattedMessage
              id="joined_date"
              defaultMessage="Joined {date}"
              values={{
                date: intl.formatDate(user.created, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
              }}
            />
          </div>
          <div>
            <i className="iconfont icon-flashlight text-icon" />
            <FormattedMessage id="voting_power" defaultMessage="Voting Power" />: <FormattedNumber
              style="percent" // eslint-disable-line react/style-prop-object
              value={user.voting_power / 10000}
              maximumFractionDigits={0}
            />
          </div>
        </div>
      </div>}
    {(user && user.name && !isSameUser) && <span>

      {/*<Action
      primary
      style={{ margin: '5px 0' }}
      text={intl.formatMessage({
        id: 'support',
        defaultMessage: 'Transfer Funds',
      })}
      onClick={() => props.openTransfer(user.name)}
    />*/}

    <BanUser 
    username={currentUsername()}
    intl={intl}
    />
    <CreateModerator 
    username={currentUsername()}
    intl={intl}
    />
    </span> 
    }
  </div>);
};

UserInfo.propTypes = {
  intl: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  authenticatedUser: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  openTransfer: PropTypes.func,
};

UserInfo.defaultProps = {
  openTransfer: () => {},
};

export default connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    user: getUser(state, ownProps.match.params.name),
  }), { openTransfer })(injectIntl(UserInfo));
