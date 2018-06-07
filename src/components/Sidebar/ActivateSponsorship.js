import React from 'react';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon'; 

import Action from '../../components/Button/Action';
import steem from 'steem';
import Cookie from 'js-cookie';

import './ActivateSponsorship.less';


class ActivateSponsorship extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      sponsorshipModal: false,
      projectName: null,
      isCreatingAccount: false,
    }
  }

  validateProjectName (callback) {
    const chosenName = this.state.projectName;
    if (!chosenName) return callback("Please choose a unique identifier.");

    const finalUsername = `${chosenName}.utp`;
    const notValidUsername = steem.utils.validateAccountName(finalUsername);
    if(notValidUsername){
      return callback(notValidUsername);
    } else {
      steem.api.getAccounts([finalUsername], function(err, result) {
        if (result.length) {
          callback("This name has been already taken. Choose another one.");
        } else {
          callback(false);
        }
      });
    }
  }

  render () {
    const { user, platform, externalId, createProjectAccount, project } = this.props;
    const loading = () => (<span><Icon type="loading"/> Loading</span>);
    return (
      <div className="Sponsorship">
        <div className="Sponsorship__container">
          <h4 className="Sponsorship__supertitle"><Icon type="heart"/> Sponsorship</h4>
          <div className="Sponsorship__divider"/>
          <div className="Sponsorship__single">
            {!project ? <span className="Announcement__content">
              Activate the Sponsorship module for this project to allow Sponsors to directly delegate voting power. <br/>
              You can also delegate your own power and use it for upvoting the project contributors.
            </span> : null}

            {project && project.sponsorship.rejected.status === false ? <span className="Announcement__content">
                Your request for activating the Sponsorship module for this project is now <b>under review</b>.
            </span> : null}

            {project && project.sponsorship.rejected.status === true ? <span className="Announcement__content">
              Your request for activating the Sponsorship module has been rejected for the following reason:<br/>
                <b>{project.sponsorship.rejected.message}</b>
            </span> : null}

            {!project || project.sponsorship.rejected.status === true ? <Action
              id="activateSponsorship"
              primary={true}
              text={project && project.sponsorship.rejected.status ? 'Try again' : 'Activate Sponsorship'}
              onClick={() => {
                this.setState({ sponsorshipModal: true })
              }}
            /> : null}
          </div>
        </div>
        <Modal
          className="sponsorship-modal"
          visible={this.state.sponsorshipModal}
          title='Activate Sponsorship for this project!'
          okText={this.state.isCreatingAccount ? loading() : 'Ok, Activate'}
          cancelText='Not yet'
          onCancel={() => {
            this.setState({ sponsorshipModal: false })
          }}
          onOk={() => {
            this.validateProjectName((validationErr) => {
              if (validationErr) {
                alert(validationErr);
              } else {
                const confirm = window.confirm("Are you sure you want to enable Sponsorship for this project? This action cannot be undone.");
                if (confirm) {
                  this.setState({
                    isCreatingAccount: true,
                  });
                  createProjectAccount(externalId, this.state.projectName, platform, user.name).then((res) => {
                    if (res.response && res.response.project_name) {
                      this.setState({ sponsorshipModal: false, isCreatingAccount: false });
                      window.location.reload();
                    } else {
                      alert("Something went wrong. Please try again.")
                    }
                  })
                }
              }
            })
          }}
        >
          <p>By activating the Sponsorship module for this project, Sponsors will be able to directly delegate voting power that you can use to upvote the project contributors.</p>
          <p>You can also delegate your own power.</p>
          <hr />
          <form>
            <label>
              <b>Create a unique identifier for this project (e.g. myprojectname).</b>
              <input type="text" onChange={(e) => this.setState({projectName: e.target.value})} />
              <span>You won't be able to change the identifier once submitted.</span>
            </label>
          </form>

        </Modal>
      </div>
    )
  }
}

export default ActivateSponsorship;
