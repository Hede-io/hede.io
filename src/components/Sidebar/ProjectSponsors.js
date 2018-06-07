import React from 'react';
import Avatar from '../Avatar';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon'; 

import { Link } from 'react-router-dom';
import Action from '../../components/Button/Action';
import steem from 'steem';

import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

import './ProjectSponsors.less';

class ProjectSponsors extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      sponsorModal: false,
      sponsors: [],
    }
  }

  loadSponsor (sponsor, project, callback) {
    steem.api.getVestingDelegations(sponsor, -1, 1000, function(err, delegations) {
      const isDelegating = find(propEq('delegatee', project.steem_account.account))(delegations);

      if (isDelegating) {
        steem.api.getDynamicGlobalProperties(function(err, result) {
          if (!err) {
            const VS = parseInt(isDelegating.vesting_shares);
            const delegatedSP = steem.formatter.vestToSteem(VS, result.total_vesting_shares, result.total_vesting_fund_steem);
            callback(delegatedSP);
          } else {
            callback(false);
          }
        })
      }
    });
  }

  componentDidMount () {
    const { project } = this.props;
    const sponsorsArr = [];
    const _self = this;

    project.sponsors.forEach((sponsorObj, index) => {
      const sponsor = sponsorObj.account;
      this.loadSponsor(sponsor, project, (delegatedSP) => {
        if (delegatedSP) {
          this.setState({
            sponsors: [
              ...this.state.sponsors,
              {
                account: sponsor,
                delegated: `${Math.round(delegatedSP)} SP`
              }
            ],
          })
        }
      })
    });
  }

  render () {
    const { project, createProjectSponsor } = this.props;
    const { platform, external_id, steem_account: { account }} = project;

    return (
      <div className="ProjectSponsors">
        <div className="ProjectSponsors__container">
          <h4 className="ProjectSponsors__supertitle"><Icon type="heart"/> Project Sponsors</h4>
          <div className="ProjectSponsors__divider"/>
          <div className="ProjectSponsors__single">
            <span>Sponsors help the growth of this project by delegating their own voting power.</span>
            <div className="ProjectSponsors__divider"/>
            <div className="ProjectSponsors__sponsors">
              <ul>
                {this.state.sponsors.map((sponsor) => {
                  return (
                    <li key={sponsor.account}>
                      <div className="ProjectSponsors__sponsor">
                        <Link to={`/@${sponsor.account}`}><Avatar username={sponsor.account} size={28}/></Link>
                        <span><Link to={`/@${sponsor.account}`}>@{sponsor.account}</Link> - {sponsor.delegated}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <Action
              id="projectSponsor"
              primary={true}
              text={<span>Become a Sponsor</span>}
              onClick={() => {
                this.setState({ sponsorModal: true })
              }}
            />
          </div>
        </div>
        <Modal
          className="project-sponsors-modal"
          visible={this.state.sponsorModal}
          title='Become a Project Sponsor!'
          okText='Proceed to Delegation'
          cancelText='Later'
          onCancel={() => this.setState({sponsorModal: false})}
          onOk={ () => {
            const sponsor = this.sponsor.value;
            const sp = this.sp.value;

            if (!sponsor) {
              alert("Please enter your Steem account. E.g. @youraccount");
              return;
            }

            // 0 is allowed to undelegate
            if (sp === 'undefined' || sp === '') {
              alert(`Please enter the amount of Steem Power you wish to delegate. You may enter 0 if you would like to undelegate or revoke sponsorship.`);
              return;
            }

            createProjectSponsor(platform, external_id, sponsor).then(res => {
              if (res.status === 500 || res.status === 404) {
                alert(res.message);
              } else {
                var scBase = process.env.STEEMCONNECT_HOST || "https://v2.steemconnect.com";
                window.location.href=`${scBase}/sign/delegate-vesting-shares?delegator=${sponsor}&delegatee=${account}&vesting_shares=${sp}%20SP&redirect_uri=${window.location.href}`;
                this.setState({sponsorModal: false});
              }
            });

          }}
        >
          <p>
            By becoming a Sponsor for this project you are delegating your voting power for the project to grow. The voting power will be used by the project maintainers to upvote the project contributors.
          </p>
          <form className="Sponsors__form">
            <label htmlFor="account">Your Steem account</label>
            <input id="sponsor" type="text" name="sponsor" placeholder="e.g. @youraccount" ref={input => this.sponsor = input} />
            <label htmlFor="sp">Steem Power to delegate, recommended is 1000 (1000.000)</label>
            <input id="sp" type="number" placeholder="e.g. 1000.000" ref={input => this.sp = input}/>
          </form>
          <p style={{'fontSize': '13px'}}>You can un-delegate anytime. Enter 0 in the field above. By un-delegating you stop receiving shares immediately.</p>
          <br/>
          <hr/>
          <p>
            You may also want to delegate your voting power directly to Hede. <b>The Hede Sponsors share 20% of all the author rewards</b> generated on the platform.
          </p>
          <p>
            <Link to="/sponsors">Become an Hede Sponsor</Link>
          </p>
        </Modal>
      </div>
    )
  }
}

export default ProjectSponsors;
