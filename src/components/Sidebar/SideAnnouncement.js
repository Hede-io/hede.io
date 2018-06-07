import React from 'react';
import Avatar from '../Avatar';
import steem from 'steem';

import Icon from 'antd/lib/icon'; 
import { Link } from 'react-router-dom';
import Action from '../../components/Button/Action';

import './SideAnnouncement.less';
import { setTimeout } from 'timers';


const SideAnnouncement = ({ user }) => {
  var SHOW_ANNOUNCEMENT_1 = 1;
  var SHOW_ANNOUNCEMENT_2 = 1;
  var SHOW_ANNOUNCEMENT_3 = 1;
  const NUMBER_OF_ANNOUNCEMENTS = () => {return (SHOW_ANNOUNCEMENT_1 + SHOW_ANNOUNCEMENT_2 + SHOW_ANNOUNCEMENT_3);}
  var voting_for_witness = false;
  const witnessCheck = async () => {
    for (var i = 0; i < user.witness_votes.length; ++i) {
        if (user.witness_votes[i] === 'hede-io') {
            SHOW_ANNOUNCEMENT_1 = 0;
            voting_for_witness = true;
            return;
        }
    }
  }
  witnessCheck();
  if (NUMBER_OF_ANNOUNCEMENTS() >= 1) {
    return (
        <div className="Announcement">
        <div className="Announcement__container">
            <h4 className="Announcement__supertitle"><Icon type="global"/> Announcements</h4>
                <div className="Announcement__divider"/>
                {(SHOW_ANNOUNCEMENT_1 === 1) ? <div id="announcement1" className="Announcement__single">
                <b className="Announcement__subtitle">Alpha Test</b>&nbsp;&nbsp;&nbsp;&nbsp;<span className="Announcement__content">Hede is currently on alpha test stage. You might encounter too many errors. Please let us know them.</span> 
                    &nbsp;&nbsp;<a target="_blank" href={`/hede-problems--4`}>Post problems</a>
                    
                </div>
                : null}
                
        </div>
        </div>
    )
    } else {
        return (
            <span></span>
        )
    }
}

export default SideAnnouncement;
