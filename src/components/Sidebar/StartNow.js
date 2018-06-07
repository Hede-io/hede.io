import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import './SidebarBlock.less';

const StartNow = () =>
  (<div className="SidebarBlock">
    <h3 className="SidebarBlock__title">
      Never written a post?
    </h3>
    <Link to="/write">
      <button className="SidebarBlock__button">
        Start now
      </button>
    </Link>
  </div>);

export default StartNow;
