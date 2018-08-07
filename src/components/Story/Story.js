import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
  FormattedRelative,
  FormattedDate,
  FormattedTime,
} from 'react-intl';
import { Link } from 'react-router-dom';
import Tag from 'antd/lib/tag';  
import Icon from 'antd/lib/icon';  
import Popover from 'antd/lib/popover';  
import Tooltip from 'antd/lib/tooltip';  

import { formatter } from 'steem';
import StoryPreview from './StoryPreview';
import StoryFooter from '../StoryFooter/StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { getModerators } from '../../actions/moderators';

import './Story.less';

@injectIntl
class Story extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    currentMedianHistoryPrice: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    pendingLike: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
    showTitle: PropTypes.bool
  };

  static defaultProps = {
    pendingLike: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    ownPost: false,
    sliderMode: 'auto',
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
    postState: {},
    showTitle: false
  };

  handleClick = (key) => {
    const { post } = this.props;
    switch (key.split('-')[0]) {
      case 'follow':
        this.props.onFollowClick(post);
        break;
      case 'save':
        this.props.onSaveClick(post);
        break;
      case 'report':
        this.props.onReportClick(post);
        break;
      case 'edit':
        this.props.onEditClick(post);
        break;
      default:
    }
  };

  postPreview(body) {
    const MAX_LENGTH = 50;
    var suffix = "...";
    if (!body) return body;
    if (body.length < MAX_LENGTH) return body;
    if (body[MAX_LENGTH-1] === '.') suffix = "..";
    return (body.substr(0, MAX_LENGTH) + suffix);
  }

  allTags(tagList) {
    if (!tagList) return <em>No Tags Provided</em>;
    var ret = "";
    for (var i = 0; i < tagList.length; ++i) {
        if (tagList[i] === 'hede-io') continue;
        ret += tagList[i];
        if (i !== tagList.length - 1) ret += ", ";
    }
    return <span><b>Tags: &nbsp;&nbsp;</b>{ret}, <em>hede-io</em></span>;
  }

  tagNumber(tagList, number) { 
    if (!tagList) return <span></span>;
    const indexOfHede = tagList.indexOf("hede-io");
    if (indexOfHede > -1) tagList.splice(indexOfHede, 1);
    const indexOfNothing = tagList.indexOf("");
    if (indexOfNothing > -1) tagList.splice(indexOfNothing, 1);
    const indexOfSpace = tagList.indexOf(" ");
    if (indexOfSpace > -1) tagList.splice(indexOfSpace, 1);
    // console.log(tagList);
    return <span>{tagList[number]}</span>;
  }

  render() {
    const {
      intl,
      user,
      post,
      postState,
      pendingLike,
      pendingFollow,
      pendingBookmark,
      saving,
      rewardFund,
      currentMedianHistoryPrice,
      ownPost,
      sliderMode,
      defaultVotePercent,
      onLikeClick,
      onShareClick,
    } = this.props;


    const metaData = post.json_metadata;
    const reviewed = post.reviewed || false;

    let followText = '';

    if (postState.userFollowed && !pendingFollow) {
      followText = intl.formatMessage(
        { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
        { username: post.author },
      );
    } else if (postState.userFollowed && pendingFollow) {
      followText = intl.formatMessage(
        { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
        { username: post.author },
      );
    } else if (!postState.userFollowed && !pendingFollow) {
      followText = intl.formatMessage(
        { id: 'follow_username', defaultMessage: 'Follow {username}' },
        { username: post.author },
      );
    } else if (!postState.userFollowed && pendingFollow) {
      followText = intl.formatMessage(
        { id: 'follow_username', defaultMessage: 'Follow {username}' },
        { username: post.author },
      );
    }

    let popoverMenu = [];

    if (ownPost) {
      popoverMenu = [
        ...popoverMenu,
        <PopoverMenuItem key={`edit-${post.id}`} >
          {saving ? <Icon type="loading" /> : <i className="iconfont icon-write" />}
          <FormattedMessage id="edit_post" defaultMessage="Edit post" />
        </PopoverMenuItem>,
      ];
    }

    if (!ownPost) {
      popoverMenu = [
        ...popoverMenu,
        <PopoverMenuItem key={`follow-${post.id}`} disabled={pendingFollow}>
          {pendingFollow ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
          {followText}
        </PopoverMenuItem>,
      ];
    }

    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key={`save-${post.id}`} >
        {pendingBookmark ? <Icon type="loading" /> : <i className="iconfont icon-collection" />}
        <FormattedMessage
          id={postState.isSaved ? 'unsave_post' : 'save_post'}
          defaultMessage={postState.isSaved ? 'Unsave post' : 'Save post'}
        />

      </PopoverMenuItem>,
      <PopoverMenuItem key={`report-${post.id}`} >
        <i className="iconfont icon-flag" />
        <FormattedMessage id="report_post" defaultMessage="Report post" />
      </PopoverMenuItem>,
    ];

    let rebloggedUI = null;

    if (post.first_reblogged_by) {
      rebloggedUI = (
        <div className="Story__reblog">
          <i className="iconfont icon-share1" />
          <FormattedMessage
            id="reblogged_username"
            defaultMessage="{username} reblogged"
            values={{
              username: <Link to={`/@${post.first_reblogged_by}`}>{post.first_reblogged_by}</Link>,
            }}
          />
        </div>
      );
    } else if (post.first_reblogged_on) {
      rebloggedUI = (
        <div className="Story__reblog">
          <i className="iconfont icon-share1" />
          <FormattedMessage id="reblogged" defaultMessage="Reblogged" />
        </div>
      );
    }

    const postType = post.json_metadata.type;

    let entryUrl = post.url;
    let indexOfHash = entryUrl.indexOf("#");

    if(indexOfHash>-1)
      entryUrl = process.env.HEDE_ENTRIES_TAG + "/" + entryUrl.substring(indexOfHash + 1);

    return (
      <div className="Story">
        {rebloggedUI}
        <div className="Story__content">
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <PopoverMenu onSelect={this.handleClick} bold={false}>
                {popoverMenu}
              </PopoverMenu>
            }
          >
          
            <i className="iconfont icon-unfold Story__more" />
          </Popover>

          <div className="Story__content">
          {this.props.showTitle &&
            <Link to={entryUrl} className="Story__content__title">
                <h2>
                  {post.title || (
                  <span>
                      <Tag color="#4f545c">RE</Tag>
                    {post.root_title}
                    </span>
                  )}
                </h2>
              
              </Link>
          }
          
          <StoryPreview text={post.body} />
          </div>
          <div className="Story__postTags nomobile">
            {/*<Tooltip title={this.allTags(post.json_metadata.tags)}>
              {(post.json_metadata.tags.length > 1) && <span>
                <Tag className="Story__postTag">{this.tagNumber(post.json_metadata.tags, 0)}</Tag>
              </span>}
              {(post.json_metadata.tags.length >= 2) && <span>
                <Tag className="Story__postTag">{this.tagNumber(post.json_metadata.tags, 1)}</Tag>
              </span>}
              {(post.json_metadata.tags.length >= 3) && <span>
                <Tag className="Story__postTag">{this.tagNumber(post.json_metadata.tags, 2)}</Tag>
              </span>}
              {(post.json_metadata.tags.length >= 4) && <span>
                <Tag className="Story__postTag">{this.tagNumber(post.json_metadata.tags, 3)}</Tag>
              </span>}
              {false && <span>
                <Tag className="Story__postTag">hede-io</Tag>
              </span>}
            </Tooltip>
              */}
            {(post.json_metadata.tags.length >= 2) && <span><br/><br/></span>}
          </div>
          <div className="Story__user Story__firstLine">
            {!this.props.showTitle &&
              <Link to={`/@${post.author}`}>
                <h4 className="Story__firstLine">
                  {/*<Avatar username={post.author} size={30} className="Story__avatar"/>*/} <span className="Story__author">{post.author}</span>
                  {/*<Tooltip title={intl.formatMessage({ id: 'reputation_score' })}>
                    <Tag className="Story__reputationTag nomobile">{formatter.reputation(post.author_reputation)}</Tag>
                    </Tooltip>*/}
                </h4>
              </Link>
            }

            <span className="yesmobile">&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <Tooltip
              title={
                <span>
                    <FormattedDate value={`${post.created}Z`} />{' '}
                  <FormattedTime value={`${post.created}Z`} />
                  </span>
              }
            >
                 <Link to={entryUrl}>
                  <span className="Story__date">
                  &nbsp;&nbsp;<FormattedRelative value={`${post.created}Z`} />
                  </span>
                </Link>
            </Tooltip>
          </div>

          <div className="Story__footer">
            <StoryFooter
              user={user}
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              rewardFund={rewardFund}
              currentMedianHistoryPrice={currentMedianHistoryPrice}
              ownPost={ownPost}
              sliderMode={sliderMode}
              defaultVotePercent={defaultVotePercent}
              onLikeClick={onLikeClick}
              onShareClick={onShareClick}
              fullMode={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Story;


