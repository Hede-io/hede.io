import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import Slider from '../Slider/Slider';
import Payout from './Payout';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import * as Actions from '../../actions/constants';
import { getHasDefaultSlider, getVoteValue } from '../../helpers/user';
import steem from 'steem';
import Cookie from 'js-cookie';
import './StoryFooter.less';

@connect(
  state => ({
    loading: state.loading,
  }),
  {
  }
)
class StoryFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    currentMedianHistoryPrice: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    pendingLike: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
    fullMode: PropTypes.bool,
  };

  static defaultProps = {
    pendingLike: false,
    ownPost: false,
    sliderMode: 'auto',
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
    fullMode: false,
  };

  state = {
    sliderVisible: false,
    sliderValue: 100,
    voteWorth: 0,
  };

  constructor(props) {
    super(props);
  }


  componentWillMount() {
    const { user, post, defaultVotePercent } = this.props;

    if (user) {
      const userVote = find(post.active_votes, { voter: user.name }) || {};
      if (userVote.percent && userVote.percent > 0) {
        this.setState({
          sliderValue: userVote.percent / 100,
        });
      } else {
        this.setState({
          sliderValue: defaultVotePercent / 100,
        });
      }
    }
  }


  handleLikeClick = () => {
    const { sliderMode, user } = this.props;

    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    } else {
      this.props.onLikeClick(this.props.post, this.props.postState);
    }
  };

  handleLikeConfirm = () => {
    const { voteWithSponsors, updateContribution } = this.props;
    const { post } = this.props;
    const postData = post.json_metadata;
    this.setState({ sliderVisible: false }, () => {
        this.props.onLikeClick(this.props.post, this.props.postState, this.state.sliderValue * 100);
    });
  };

  handleShareClick = () => this.props.onShareClick(this.props.post);

  handleEditClick = () => this.props.onEditClick(this.props.post);

  handleSliderCancel = () => this.setState({ sliderVisible: false });

  handleSliderChange = (value) => {
    const { user, rewardFund, currentMedianHistoryPrice } = this.props;
    const { sponsorsAccount } = this.state;

      const voteWorth = getVoteValue(
        user,
        rewardFund.recent_claims,
        rewardFund.reward_balance,
        currentMedianHistoryPrice,
        value * 100,
      );
      this.setState({ sliderValue: value, voteWorth });
   
  };

  render() {
    const { post, postState, pendingLike, loading, ownPost, defaultVotePercent, fullMode } = this.props;

    return (
      <div className="StoryFooter">
        <div className="StoryFooter__actions">
          <Payout post={post} fullMode={fullMode}/>
          {this.state.sliderVisible && (
            <Confirmation onConfirm={this.handleLikeConfirm} onCancel={this.handleSliderCancel} />
          )}
          {!this.state.sliderVisible && (
            <Buttons
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              ownPost={ownPost}
              defaultVotePercent={defaultVotePercent}
              onLikeClick={this.handleLikeClick}
              onShareClick={this.handleShareClick}
              onEditClick={this.handleEditClick}
            />
          )}
        </div>
      
      </div>
    );
  }
}

export default StoryFooter;
