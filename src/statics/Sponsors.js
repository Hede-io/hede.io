import React from 'react';
import { connect } from 'react-redux';
import { createSponsor } from '../actions/sponsor';
import { getSponsors } from '../actions/sponsors';
import { getStats } from '../actions/stats';
import * as Actions from '../actions/constants';
import { Link } from 'react-router-dom';

import steem from 'steem';
import Action from '../components/Button/Action';
import Modal from 'antd/lib/modal'; 
import Icon from 'antd/lib/icon'; 

import './Sponsors.less';

@connect(
  (state, ownProps) => ({
    sponsors: state.sponsors,
    stats: state.stats,
    loading: state.loading,
  }), { createSponsor, getSponsors, getStats })
class Sponsors extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      sponsorModal: false,
      delegationTypeModal: false,
      delegationSP: 1500,
      delegationAccount: "",
      total_vesting_shares: 0,
      total_vesting_fund_steem: 0,
      vestsPerSteem: 1.00,
    };
  }

  componentWillMount () {
    const { getSponsors, getStats } = this.props;
    const _self = this;
    getStats();
    getSponsors();
    steem.api.getDynamicGlobalProperties(function(err, result) {
      console.log("RES", result);
      if (!err) {
        _self.setState({
          total_vesting_shares: result.total_vesting_shares,
          total_vesting_fund_steem: result.total_vesting_fund_steem,
        });
      }
    })
    const vestsPerSteem = (1.000) / (steem.formatter.vestToSteem(1, this.state.total_vesting_shares, this.state.total_vesting_fund_steem));
  }

   openURI(url, inNewTab) {
        var a = document.createElement("a");
        if (inNewTab === true) a.target = "_blank";
        a.href = url;
        a.click();
    }

  generateSteemURI(from, amount) {
    from = from.replace("@", "");
    console.log("Generating for amount ", amount, " vesting_fund_steem: ", this.state.total_vesting_fund_steem, " vesting_shares var:", this.state.total_vesting_shares);
    const amt =  ((parseFloat(amount) / parseFloat(this.state.total_vesting_fund_steem))) * parseFloat(this.state.total_vesting_shares);
    const amtVests = `${amt.toFixed(6)} VESTS`;
    console.log("DELEGATING ", amtVests);
    const preSuffix = [
      [
        "delegate_vesting_shares",
        {
          "delegator": from,
          "delegatee": "hede",
          "vesting_shares": (amtVests).toString(),
        }
      ]
    ];
    const suffix = window.btoa(JSON.stringify(preSuffix));
    console.log("DELEGATION JSON: ", preSuffix);
    return `steem://sign/tx/${suffix}#e30=`;
  }

  render () {
    const { createSponsor, loading, sponsors, stats, match, location } = this.props;
    const isLoading = loading === Actions.CREATE_SPONSOR_SUCCESS;
    const steemconnectHost = process.env.STEEMCONNECT_HOST || "https://v2.steemconnect.com";

    if (location.search.indexOf('plain') > -1) {
      return (
        <div>
          {sponsors.map(sponsor => {
            const voteWitness = () => ('(<a href="' + process.env.STEEMCONNECT_HOST + '/sign/account-witness-vote?witness='+sponsor.account+'&approve=1">Vote for Witness</a>)');
            return (
              <div key={sponsor.account}>@{sponsor.account} {sponsor.is_witness ? voteWitness() : null}</div>
            )
          })}
        </div>
      )
    }

    return (
      <div className="main-panel help-section">
        <div className="container text-center my-5">
          <div className="Sponsors">
            <div className="Sponsors__intro">
              <h1>The Hede Sponsors <Icon type="heart" /> The Open Source World!</h1>
              <p>Hede uses the delegated Steem Power to reward the best Open Source contributions.</p>
              <p><b>20% of the total contributor rewards generated goes to the Sponsors based on their delegated amount.</b></p>
              <div
                className="Sponsors__intro-delegate"
                onClick={() => this.setState({sponsorModal: true})}>
                DELEGATE
              </div>
            </div>
            <div style={{textAlign: "center"}}><em>All the below figures converted in USD for simplicity. Will be sent as Steem Power.</em></div>
            <div className="Sponsors__stats">
              <div className="Sponsors__stats-box">
                <h3>${Math.round(stats.total_pending_rewards)}</h3>
                <p><b>Pending Rewards</b></p>
              </div>
              <div className="Sponsors__stats-box">
                <h3>${Math.round(stats.total_paid_authors)}</h3>
                <p><b>Released Contributors Rewards</b></p>
              </div>
              <div className="Sponsors__stats-box">
                <h3>${Math.round(stats.total_paid_curators)}</h3>
                <p><b>Released Curators Rewards</b></p>
              </div>
              <div className="Sponsors__stats-box">
                <h3>${Math.round(stats.total_paid_rewards) + Math.round(stats.total_pending_rewards)}</h3>
                <p><b>Total Generated</b></p>
              </div>
            </div>
            <div><h2>HEROES</h2></div>
            <div style={{textAlign: "center"}}><em>20% of all the author rewards generated on Hede are reserved for the sponsors.</em></div>
            <div className="Sponsors__heroes">
              {sponsors.map(sponsor => {
                const VS = sponsor.vesting_shares;
                const delegatedSP = steem.formatter.vestToSteem(VS, this.state.total_vesting_shares, this.state.total_vesting_fund_steem);
                const picture = `https://img.busy.org/@${sponsor.account}?s=72`;
                const username = sponsor.account;
                return (
                  <div key={username} className="Sponsors__heroes-hero">
                    <div className="infoCont">
                      <Link to={`/@${username}`}>
                        <img className="picture" src={picture} />
                        <b className="account">{username}</b>
                      </Link>
                    </div>
                    <div className="statsTab">
                      <h4>{Math.round(delegatedSP)} SP</h4>
                      <p><b>Delegated Steem Power</b></p>
                    </div>
                    <div className="statsTab">
                      <h4>{!sponsor.opted_out ? Math.ceil((sponsor.percentage_total_vesting_shares || 0) * 100) / 100 + '%' : 'OPTED OUT FROM REWARDS'}</h4>
                      <p><b>Hede Reward Shares</b></p>
                    </div>
                    <div className="statsTab">
                      <h4>{!sponsor.opted_out ? Math.ceil((sponsor.total_paid_rewards_steem || 0) * 100) / 100 : 'OPTED OUT FROM REWARDS'}</h4>
                      <p><b>STEEM Received</b></p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Modal
              visible={this.state.sponsorModal}
              title='Become an Hede Sponsor!'
              okText={isLoading ? <Icon type="loading"/> : 'Delegate!'}
              cancelText='Later'
              onCancel={() => this.setState({sponsorModal: false})}
              onOk={ () => {
                const account = this.account.value;
                const sp = this.sp.value;


                if (!account) {
                  alert("Please enter your Steem account. E.g. @youraccount");
                  return;
                }

                // 0 is allowed to undelegate
                if (sp === 'undefined' || sp === '') {
                  alert(`Please enter the amount of Steem Power you wish to delegate.`);
                  return;
                }

                createSponsor(account).then(res => {
                  if (res.status === 500 || res.status === 404) {
                    alert(res.message);
                  } else {
                    this.setState({delegationAccount: account});
                    this.setState({delegationSP: sp});
                    this.setState({delegationTypeModal: true});
                    this.setState({sponsorModal: false});
                  }
                });
              }}
            >
              <p>
                You can become an <b>Hede Sponsor</b> by delegating your <b>Steem Power</b>.
                Delegating means that you are securely lending your Steem Power to Hede for as long as you wish and have it back at any time.
                <br /><br />
                <b>20% of the total author rewards generated on Hede are dedicated to the Sponsors and shared proportionally based on the delegated amount.</b>
                <br /><br />
                In addition Hede will give you credit on <b>every promotional activity, official news and on the dedicated sponsor sections</b>.
                <br /><br />
                <b>Hede uses the delegated Steem Power to upvote the best contributions on the platform</b>. You are actually contributing to the <b>Whole Open Source World</b>.
                <br /><br />
              </p>
              <form className="Sponsors__form">
                <label htmlFor="account">Your Steem account</label>
                <input id="account" type="text" name="account" placeholder="e.g. @youraccount" ref={input => this.account = input} />
                <label htmlFor="sp">Steem Power to delegate, recommended is 1000 (1000.000)</label>
                <input id="sp" type="number" placeholder="e.g. 1000.000" ref={input => this.sp = input}/>
              </form>
              <p style={{'fontSize': '13px'}}>You can un-delegate anytime. Enter 0 in the field above. By un-delegating you stop receiving shares immediately.</p>
            </Modal>


            <Modal
              visible={this.state.delegationTypeModal}
              title='Complete your Delegation!'
              onCancel={() => {this.setState({delegationTypeModal: false}); this.setState({sponsorModal: true});}}
              footer={
                <span>
                <Action
                  positive={true}
                  style={{color: "white"}}
                  text={<span>Use Vessel App</span>}
                  onClick={() => {this.setState({delegationTypeModal: false}); this.openURI(this.generateSteemURI(this.state.delegationAccount, this.state.delegationSP), false);}}
                  /><br/>
                  <Action
                  primary={true}
                  style={{color: "white"}}
                  text={<span>Use SteemConnect.com</span>}
                  onClick={() => {this.setState({delegationTypeModal: false}); this.openURI(`${steemconnectHost}/sign/delegate-vesting-shares?delegator=${this.state.delegationAccount}&delegatee=hede&vesting_shares=${this.state.delegationSP}%20SP&redirect_uri=${window.location.href}`, true);}}
                  />
                  </span>
              }
            >
            There are multiple secure methods you can use to delegate:<br/>
            <ul style={{listStyleType: 'disc', listStylePosition: 'inside'}}>
            <li> <b>Vessel</b> Click the Green button to use Vessel's desktop app to delegate. You must have version 0.2.0 or higher. </li>
            <li> <b>SteemConnect</b> Click the Blue button to use Steemconnect, a website maintained by Steemit, to delegate.</li>
            </ul>
            </Modal>

          </div>
        </div>
      </div>
    )
  }

}

export default Sponsors;
