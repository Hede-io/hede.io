import React from 'react';

import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './SidebarBlock.less';

const GetBoost = () =>
  (<div className="SidebarBlock">
    <h3 className="SidebarBlock__title">
      <FormattedMessage id="tell_story" defaultMessage="Tell us your story!" />
    </h3>
    <p>
      Tell us the story behind your contributions to this Open Source project and get rewarded for your hard work.
    </p>
    <p>
      <Link className="SidebarBlock__helplink" to={`/help/#contributor-report`}>
        <button className="SidebarBlock__button">
          <span className="SidebarBlock__text">LEARN HOW</span>
        </button>
      </Link>
    </p>
  </div>);

export default GetBoost;
