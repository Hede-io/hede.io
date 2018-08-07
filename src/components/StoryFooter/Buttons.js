import React from 'react';
import PropTypes from 'prop-types';
import take from 'lodash/take';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';

import Icon from 'antd/lib/icon'; 
import Tooltip from 'antd/lib/tooltip'; 
import Modal from 'antd/lib/modal'; 

import MdKeyboardArrowDown from 'react-icons/lib/md/keyboard-arrow-down';
import MdThumbUp from 'react-icons/lib/md/thumb-up';
import MdInsertComment from 'react-icons/lib/md/insert-comment';
//MdKeyboardArrowDown , MdThumbUp, MdInsertComment
import classNames from 'classnames';
import ReactionsModal from '../Reactions/ReactionsModal';
import USDDisplay from '../Utils/USDDisplay';
import { sortVotes } from '../../helpers/sortHelpers';
import { getUpvotes, getDownvotes } from '../../helpers/voteHelpers';
import './Buttons.less';

@injectIntl
export default class Buttons extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    ownPost: PropTypes.bool,
    pendingLike: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
  };

  static defaultProps = {
    ownPost: false,
    pendingLike: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
  };

  state = {
    shareModalVisible: false,
    shareModalLoading: false,
    reactionsModalVisible: false,
    loadingEdit: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.postState.isReblogging !== this.props.postState.isReblogging) {
      this.setState({
        shareModalLoading: nextProps.postState.isReblogging,
        shareModalVisible:
          !(!nextProps.postState.isReblogging && this.props.postState.isReblogging) &&
          this.state.shareModalVisible,
      });
    }
  }

  handleShareClick = (e) => {
    e.preventDefault();
    if (this.props.postState.isReblogged) {
      return;
    }

    this.setState({
      shareModalVisible: true,
    });
  };

  handleShareOk = () => {
    this.props.onShareClick();
  };

  handleShareCancel = () => {
    this.setState({
      shareModalVisible: false,
    });
  };

  handleShowReactions = () =>
    this.setState({
      reactionsModalVisible: true,
    });

  handleCloseReactions = () =>
    this.setState({
      reactionsModalVisible: false,
    });

  handleCommentClick = () => {
    const form = document.getElementById('commentFormInput');
    if (form) {
      form.scrollIntoView(true);
      document.body.scrollTop -= 200;
      form.focus();
    }
  };

  handleEdit = () => {
    this.setState({
      loadingEdit: true,
    });
    this.props.onEditClick();
  };

  render() {
    const { intl, post, postState, pendingLike, ownPost, defaultVotePercent } = this.props;

    const upVotes = getUpvotes(post.active_votes).sort(sortVotes);
    const downVotes = getDownvotes(post.active_votes)
      .sort(sortVotes)
      .reverse();

    const totalPayout =
      parseFloat(post.pending_payout_value) +
      parseFloat(post.total_payout_value) +
      parseFloat(post.curator_payout_value);
    const voteRshares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
    const ratio = totalPayout / voteRshares;

    const upVotesPreview = take(upVotes, 10).map(vote => (
      <p key={vote.voter} className={`${(vote.voter == 'hede-io') ? 'Buttons__makeBold' : ''}`}>
        <Link style={{ color: '#FFF'}} to={`/@${vote.voter}`}>{vote.voter}</Link>

        {vote.rshares * ratio > 0.01 && (
          <span style={{ opacity: '0.5' }}>
            {' '}
            <USDDisplay value={vote.rshares * ratio} />
          </span>
        )}
      </p>
    ));
    const upVotesDiff = upVotes.length - upVotesPreview.length;
    const upVotesMore =
      upVotesDiff > 0 && (
        <p>
          <a style={{ color: '#FFF'}} role="presentation" onClick={this.handleShowReactions}>
              <center><MdKeyboardArrowDown />&nbsp;&nbsp;<FormattedMessage id="and_more_amount" defaultMessage="and {amount} more" values={{ amount: upVotesDiff }} />&nbsp;&nbsp;<MdKeyboardArrowDown /></center>
          </a>
        </p>
      );

    const likeClass = classNames({ active: postState.isLiked, Buttons__activeIcon: postState.isLiked, Buttons__link: true, Buttons__likeBtn: true, Buttons__reactIcon: true });
    const rebloggedClass = classNames({ active: postState.isReblogged, Buttons__link: true });

    let postUrl = post.url;
    let indexOfHash = postUrl.indexOf("#");

    if(indexOfHash>-1)
      postUrl = process.env.HEDE_ENTRIES_TAG + "/" + postUrl.substring(indexOfHash + 1);

    const commentsLink =
      indexOfHash !== -1 ?  postUrl: { pathname: postUrl, hash: '#comments' };
      // console.log(post.cashout_time);
    const showEditLink = ownPost && post.cashout_time !== '1969-12-31T23:59:59' && (new Date(post.cashout_time + "Z") < new Date(0));
    //const showReblogLink = !ownPost && post.parent_author === '';
    const showReblogLink = false; // @HEDE forced no reblog

    let likeTooltip = <span>{intl.formatMessage({ id: 'like' })}</span>;
    if (postState.isLiked) {
      likeTooltip = <span>{intl.formatMessage({ id: 'unlike', defaultMessage: 'Change vote' })}</span>;
    } else if (defaultVotePercent !== 10000) {
      likeTooltip = (
        <span>
          {intl.formatMessage({ id: 'like' })}{' '}
          <span style={{ opacity: 0.5 }}>
            <FormattedNumber
              style="percent" // eslint-disable-line
              value={defaultVotePercent / 10000}
            />
          </span>
        </span>
      );
    }

    return (
      <div className="Buttons">
        
          <a role="presentation" className={likeClass} onClick={this.props.onLikeClick}>
            {pendingLike ? (
              <Icon type="loading" />
            ) : (
              <span>
              {this.state.sliderVisible ? 
              <i
                className={`iconfont icon-right`}
              />
              : <MdThumbUp className={likeClass}/>}
              </span>
            )}
          </a>
        
        <span
          className={classNames('Buttons__number', {
            'Buttons__reactions-count': upVotes.length > 0 || downVotes.length > 0,
          })}
          role="presentation"
          onClick={this.handleShowReactions}
        >
          <Tooltip
            title={
              <div>
                {upVotesPreview}
                {upVotesMore}
                {upVotesPreview.length === 0 && (
                  <FormattedMessage id="no_likes" defaultMessage="No likes yet" />
                )}
              </div>
            }
          >
            <FormattedNumber value={upVotes.length} />
            <span />
          </Tooltip>
        </span>
        <Tooltip title={intl.formatMessage({ id: 'comment', defaultMessage: 'Comment' })}>
          <Link className="Buttons__link" to={commentsLink} onClick={this.handleCommentClick}>
            <MdInsertComment className="Buttons__commentBtn Buttons__reactIcon"/>
          </Link>
        </Tooltip>
        <span className="Buttons__number">
          <FormattedNumber value={post.children} />
        </span>
        {showReblogLink && (
          <Tooltip
            title={intl.formatMessage({
              id: postState.reblogged ? 'reblog_reblogged' : 'reblog',
              defaultMessage: postState.reblogged ? 'You already reblogged this post' : 'Reblog',
            })}
          >
            <a role="presentation" className={rebloggedClass} onClick={this.handleShareClick}>
              <i className="iconfont icon-share1 Buttons__share" />
            </a>
          </Tooltip>
        )}
        {showEditLink && (
          <a role="presentation" className="Buttons__link" onClick={this.handleEdit}>
            {this.state.loadingEdit ? (
              <Icon type="loading" />
            ) : (
              <i className="iconfont icon-write" />
            )}
            <FormattedMessage id="edit" defaultMessage="Edit" />
          </a>
        )}
        {!postState.isReblogged && (
          <Modal
            title={intl.formatMessage({
              id: 'reblog_modal_title',
              defaultMessage: 'Reblog this post?',
            })}
            visible={this.state.shareModalVisible}
            confirmLoading={this.state.shareModalLoading}
            okText={intl.formatMessage({ id: 'reblog', defaultMessage: 'Reblog' })}
            cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
            onOk={this.handleShareOk}
            onCancel={this.handleShareCancel}
          >
            <FormattedMessage
              id="reblog_modal_content"
              defaultMessage="This post will appear on your personal feed. This action cannot be reversed."
            />
          </Modal>
        )}
        <ReactionsModal
          visible={this.state.reactionsModalVisible}
          upVotes={upVotes}
          ratio={ratio}
          downVotes={downVotes}
          onClose={this.handleCloseReactions}
        />
      </div>
    );
  }
}
