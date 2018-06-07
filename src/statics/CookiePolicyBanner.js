import React, { Component } from 'react';
import Button  from 'antd/lib/button';
import { withRouter, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import './CookiePolicyBanner.less';

@withRouter
export default class CookiePolicyBanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCookiePolicyAccepted: Cookies.get('isCookiePolicyAccepted') || false,
    };
  }

  handleAcceptButtonClick = () => {
    this.setState({
      isCookiePolicyAccepted: true,
    });

    Cookies.set(
      'isCookiePolicyAccepted',
      true,
      {
        expires: 3650, // ten years from now
        domain: process.env.NODE_ENV === 'development'
          ? 'localhost'
          : 'hede.io',
      },
    );
  }

  render() {
    if (this.state.isCookiePolicyAccepted) {
      return null;
    }

    return (
      <div className="CookiePolicyBanner">
        <div>
          <p className="CookiePolicyBanner__PolicySummary">
            To help provide a safer and more optimal experience, we use cookies. By clicking or navigating the site, you agree to allow our collection of information on and off Hede through cookies. Learn more, including about available controls: 
            <NavLink className="CookiePolicyBanner__PolicyLink" to="/cookies">Cookies Policy</NavLink>.
          </p>
          <p className="CookiePolicyBanner__PolicySummary">
            If you do not agree with our Cookie Policy, 
            <a href="https://www.google.com" className="CookiePolicyBanner__PolicyLink">please leave the site</a>.
          </p>
        </div>
        <Button
          className="CookiePolicyBanner__ProceedButton"
          onClick={this.handleAcceptButtonClick}
        >OK</Button>
      </div>
    );
  }
}
