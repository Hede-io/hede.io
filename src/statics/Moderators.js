import React from 'react';
import { connect } from 'react-redux';
import { getModerators } from '../actions/moderators';
import { getStats } from '../actions/stats';
import { Link } from 'react-router-dom';

import Icon from 'antd/lib/icon'; 

import './Moderators.less';

@connect(
  (state, ownProps) => ({
    moderators: state.moderators,
    stats: state.stats,
  }), { getModerators, getStats })
class Moderators extends React.PureComponent {

  componentWillMount () {
    const { moderators, getModerators, getStats } = this.props;
    getStats();
    if (!moderators || !moderators.length) {
        getModerators();
    }  
  }

  render () {
    const { moderators, stats } = this.props;

    return (
      <div className="main-panel help-section">
        <div className="container text-center my-5">
          <div className="Moderators">
            <div className="Moderators__intro">
              <h1><Icon type="safety"/> The Hede Moderators</h1>
              <p><b>5% of the total contributor rewards generated goes to the Moderators based on the amount of contributions they have reviewed.</b></p>
              <p>To become an Hede Moderator you must have high reputation and often review submitted contributions.</p>
            </div>
            <br />
            <div style={{textAlign: "center"}}>
              <em>All the below figures converted in USD for simplicity. Will be sent as Steem Power.</em>
            </div>
            <div className="Moderators__stats">
              <div className="Moderators__stats-box">
                <h3>${Math.round(stats.total_pending_rewards)}</h3>
                <p><b>Pending Rewards</b></p>
              </div>
              <div className="Moderators__stats-box">
                <h3>${Math.round(stats.total_paid_authors)}</h3>
                <p><b>Released Contributors Rewards</b></p>
              </div>
              <div className="Moderators__stats-box">
                <h3>${Math.round(stats.total_paid_curators)}</h3>
                <p><b>Released Curators Rewards</b></p>
              </div>
              <div className="Moderators__stats-box">
                <h3>${Math.round(stats.total_paid_rewards) + Math.round(stats.total_pending_rewards)}</h3>
                <p><b>Total Generated</b></p>
              </div>
            </div>
            <div><h2><Icon type="safety"/> MODERATORS</h2></div>
            <div style={{textAlign: "center"}}><em>5% of all the author rewards generated on Hede are reserved for the moderators.</em></div>
            <div className="Moderators__moderators">
              {moderators.map(moderator => {
                const picture = `https://img.busy.org/@${moderator.account}?s=72`;
                const username = moderator.account;
                return (
                  <div key={username} className="Moderators__moderators-moderator">
                    <div className="infoCont">
                      <Link to={`/@${username}`}>
                        <img className="picture" src={picture} />
                        <b className="account">{username}</b>
                        <small>{' '}{moderator.supermoderator === true ? '[supervisor]' : null}</small>
                      </Link>
                    </div>
                    <div className="statsTab">
                      <h4>{moderator.total_moderated || 0}</h4>
                      <p><b>Total Reviewed</b></p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Moderators;
