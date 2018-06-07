import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import Tag from 'antd/lib/tag';
import Tooltip from 'antd/lib/tooltip';
import Popover from 'antd/lib/popover';

import { formatter } from 'steem';
import Avatar from './Avatar';
import FollowButton from '../widgets/FollowButton';
import Action from './Button/Action';
import PopoverMenu, { PopoverMenuItem } from './PopoverMenu/PopoverMenu';
import getImage from '../helpers/getImage';
import { getUserRankKey, getUserRank } from '../helpers/user';
import './UserHeader.less';

const UserHeader = ({
  intl,
  authenticated,
  username,
  handle,
  userReputation,
  rank,
  isSameUser,
  hasCover,
  onSelect,
  isPopoverVisible,
  handleVisibleChange,
}) =>
  (<div
    className={classNames('UserHeader', { 'UserHeader--cover': hasCover })}
    style={{ backgroundImage: `url("${getImage(`@${handle}/cover`)}")` }}
  >
    <div className="UserHeader__container">
      <Avatar username={handle} size={100} />
      <div className="UserHeader__user">
        <div className="UserHeader__row">
          <h2 className="UserHeader__user__username">
            {username}
            <Tooltip title={intl.formatMessage({ id: 'reputation_score', defaultMessage: 'Reputation Score' })}>
              <Tag>
                {formatter.reputation(userReputation)}
              </Tag>
            </Tooltip>
          </h2>
          <div className="UserHeader__user__button">
            {authenticated &&
              (isSameUser
                ? <a target="_blank" rel="noopener noreferrer" href={`https://steemit.com/@${handle}/settings`}>
                  <Action small text={<span>Edit profile</span>} />
                </a>
                : <FollowButton username={handle} />)
            }
          </div>
          {!isSameUser && (
            <Popover
              placement="bottom"
              trigger="click"
              visible={isPopoverVisible}
              onVisibleChange={handleVisibleChange}
              content={
                <PopoverMenu onSelect={onSelect}>
                  <PopoverMenuItem key="transfer">
                    <FormattedMessage id="transfer" defaultMessage="Transfer" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="mute">
                    <FormattedMessage id="block_user" defaultMessage="Block this user" />
                  </PopoverMenuItem>
                </PopoverMenu>
              }
            >
              <i className="iconfont icon-more UserHeader__more" />
            </Popover>
          )}
        </div>
        <div className="UserHeader__row UserHeader__handle">
          @{handle}
        </div>
        <div className="UserHeader__rank">
          <i className="iconfont icon-ranking" /> {rank}
        </div>
      </div>
    </div>
  </div>);

UserHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  username: PropTypes.string,
  handle: PropTypes.string,
  userReputation: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  rank: PropTypes.string,
  isSameUser: PropTypes.bool,
  hasCover: PropTypes.bool,
  onSelect: PropTypes.func,
  isPopoverVisible: PropTypes.bool,
  handleVisibleChange: PropTypes.func,
};

UserHeader.defaultProps = {
  username: '',
  handle: '',
  userReputation: '0',
  rank: 'Minnow',
  isSameUser: false,
  hasCover: false,
  onSelect: () => {},
  isPopoverVisible: false,
  handleVisibleChange: () => {},
};

export default injectIntl(UserHeader);
