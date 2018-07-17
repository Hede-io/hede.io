import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { Helmet } from 'react-helmet';
const domPurify = require('dompurify');
let domPurifyImp = null;

import { getHasDefaultSlider } from '../helpers/user';
import getImage from '../helpers/getImage';
import {
  getAuthenticatedUser,
  getBookmarks,
  getPendingBookmarks,
  getPendingLikes,
  getRebloggedList,
  getPendingReblogs,
  getFollowingList,
  getPendingFollows,
  getIsEditorSaving,
  getVotingPower,
  getRewardFund,
  getCurrentMedianHistoryPrice,
  getVotePercent,
} from '../reducers';
import { editPost } from './Write/editorActions';
import { votePost } from './postActions';
import { reblog } from '../app/Reblog/reblogActions';
import { toggleBookmark } from '../bookmarks/bookmarksActions';
import { followUser, unfollowUser } from '../user/userActions';
import { getHtml } from '../components/Story/Body';
import StoryFull from '../components/Story/StoryFull';

import { getModerators } from '../actions/moderators';
import { moderatorAction } from '../actions/entry';
import { getTitles } from '../actions/titles';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
    bookmarks: getBookmarks(state),
    pendingBookmarks: getPendingBookmarks(state),
    pendingLikes: getPendingLikes(state),
    reblogList: getRebloggedList(state),
    pendingReblogs: getPendingReblogs(state),
    followingList: getFollowingList(state),
    pendingFollows: getPendingFollows(state),
    saving: getIsEditorSaving(state),
    moderators: state.moderators,
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    currentMedianHistoryPrice: getCurrentMedianHistoryPrice(state),
    defaultVotePercent: getVotePercent(state),
  }),
  {
    editPost,
    votePost,
    reblog,
    toggleBookmark,
    followUser,
    unfollowUser,
    moderatorAction,
    getModerators,
    getTitles,
  },
)
class PostContent extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    content: PropTypes.shape().isRequired,
    pendingLikes: PropTypes.arrayOf(PropTypes.number),
    reblogList: PropTypes.arrayOf(PropTypes.number),
    pendingReblogs: PropTypes.arrayOf(PropTypes.number),
    followingList: PropTypes.arrayOf(PropTypes.string),
    pendingFollows: PropTypes.arrayOf(PropTypes.string),
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number).isRequired,
    saving: PropTypes.bool.isRequired,
    rewardFund: PropTypes.shape().isRequired,
    currentMedianHistoryPrice: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    bookmarks: PropTypes.shape(),
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    editPost: PropTypes.func,
    toggleBookmark: PropTypes.func,
    votePost: PropTypes.func,
    reblog: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    pendingLikes: [],
    reblogList: [],
    pendingReblogs: [],
    followingList: [],
    pendingFollows: [],
    bookmarks: {},
    sliderMode: 'auto',
    editPost: () => {},
    toggleBookmark: () => {},
    votePost: () => {},
    reblog: () => {},
    followUser: () => {},
    unfollowUser: () => {},
  };
  state = {
    dbTitle: {}
  }

  componentWillMount () {
    const { getModerators, moderators } = this.props;

    if (!moderators || !moderators.length) {
      getModerators();
    }
  }

  componentDidMount() {
    const { hash } = window.location;
    // PostContent renders only when content is loaded so it's good moment to scroll to comments.
    if (hash.indexOf('comments') !== -1 || /#@[a-zA-Z-.]+\/[a-zA-Z-]+/.test(hash)) {
      const el = document.getElementById('comments');
      if (el) el.scrollIntoView({ block: 'start' });
    }

    this.getMyTitle(this.props.content.hede_title);
  }

  componentWillReceiveProps(nextProps){
    this.getMyTitle(nextProps.content.hede_title);
  }

  getMyTitle = (titleId)=>{

    this.props.getTitles({
      skip:0,
      limit:1,
      section: 'all',
      sortBy: 'created',
      titleId: titleId,
      reset: false,
    }).then(res=>{
      this.setState({
        dbTitle: res.response.results[0]
      });
    });
  }

  handleLikeClick = (post, postState, weight = 10000) => {
    const { sliderMode, user, defaultVotePercent } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      this.props.votePost(post.id, post.author, post.permlink, weight);
    } else if (postState.isLiked) {
      this.props.votePost(post.id, post.author, post.permlink, 0);
    } else {
      this.props.votePost(post.id, post.author, post.permlink, defaultVotePercent);
    }
  };

  handleReportClick = post => this.props.votePost(post.id, post.author, post.permlink, -10000);

  handleShareClick = post => this.props.reblog(post.id);

  handleSaveClick = post => this.props.toggleBookmark(post.id, post.author, post.permlink);

  handleFollowClick = (post) => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  };

  handleEditClick = post => this.props.editPost(post);

  render() {
    const {
      user,
      content,
      pendingLikes,
      reblogList,
      pendingReblogs,
      followingList,
      pendingFollows,
      bookmarks,
      pendingBookmarks,
      saving,
      sliderMode,
      rewardFund,
      currentMedianHistoryPrice,
      defaultVotePercent,
      moderatorAction,
      moderators,
      history,
    } = this.props;

    const postMetaData = content.json_metadata;
    const busyHost = 'https://hede.io';
    let canonicalHost = busyHost;

    const userVote = find(content.active_votes, { voter: user.name }) || {};

    const postState = {
      isReblogged: reblogList.includes(content.id),
      isReblogging: pendingReblogs.includes(content.id),
      isSaved: !!bookmarks[content.id],
      isLiked: userVote.percent > 0,
      isReported: userVote.percent < 0,
      userFollowed: followingList.includes(content.author),
    };

    const { title, category, created, author, body } = content;
    const postMetaImage = postMetaData.image && postMetaData.image[0];
    const htmlBody = getHtml(body, {}, 'text');

    if(!domPurifyImp)
      domPurifyImp = domPurify(window);

    const bodyText = domPurifyImp.sanitize(htmlBody, { ALLOWED_TAGS: ["br", "blockquote", "img", "link", "a", "p", "iframe", "ul", "ol", "li"] });
    const desc = `${bodyText.substring(0, 140)} by ${author}`;
    const image = postMetaImage || getImage(`@${author}`);
    const canonicalUrl = `${canonicalHost}${content.url}`;
    const url = `${busyHost}${content.url}`;
    const metaTitle = `${title} - ${author} Wiki`;
    
    return (
      <div>
        <Helmet>
          <title>
            {metaTitle}
          </title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Hede" />
          <meta property="article:tag" content={category} />
          <meta property="article:published_time" content={created} />
          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={metaTitle} />
          <meta property="twitter:description" content={desc} />
          <meta
            property="twitter:image"
            content={image || 'https://hede.io/img/hede_thumbnail2.png'}
          />
        </Helmet>
        <StoryFull
          history={history}
          user={user}
          moderators={moderators}
          moderatorAction={moderatorAction}
          post={content}
          postState={postState}
          commentCount={content.children}
          pendingLike={pendingLikes.includes(content.id)}
          pendingFollow={pendingFollows.includes(content.author)}
          pendingBookmark={pendingBookmarks.includes(content.id)}
          saving={saving}
          rewardFund={rewardFund}
          currentMedianHistoryPrice={currentMedianHistoryPrice}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          ownPost={author === user.name}
          onLikeClick={this.handleLikeClick}
          onReportClick={this.handleReportClick}
          onShareClick={this.handleShareClick}
          onSaveClick={this.handleSaveClick}
          onFollowClick={this.handleFollowClick}
          onEditClick={this.handleEditClick}
          titleUrl={"/" + this.state.dbTitle.slug}
        />
      </div>
    );
  }
}

export default PostContent;
