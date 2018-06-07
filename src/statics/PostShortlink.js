import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPostById } from '../actions/entries';
import { Link } from 'react-router-dom';

import Icon from 'antd/lib/icon'; 

import './Moderators.less';

@connect(
    (state) => ({
    }), { getPostById })
class PostShortlink extends React.PureComponent {
    // static propTypes = {
    //     postId: PropTypes.object,
    // }
    // static defaultProps = {
    //     postId: '404',
    // }
    constructor (props) {
      super(props);
  
      this.state = {
        sponsorModal: false,
        total_vesting_shares: 0,
        total_vesting_fund_steem: 0,
      };
    }
    fallBack() {
        window.location.href = "/";
    }
    componentWillMount() {
        console.log("POST SHORTLINK MOUNTING");
        const { match } = this.props;
        if (!match.params.postId || match.params.postId === '404') {
            this.fallBack();
        }
        console.log("POST ID: ", match.params.postId);
    }
    render() {
        const { getPostById, match } = this.props;
        var success = false;
        if (!match.params.postId) this.fallBack();
        var postId = match.params.postId;
        const toInt = (x) => {
            if (x === parseInt(x, 10) || !isNaN(x)) {
                return parseInt(x);
            }
            return x;
        }

        try {
            getPostById(toInt(postId)).then((post) => {
                if (post && post.response && post.response.url) {
                    console.log("POST SHORTLINK, redirecting to: ", post.response.url);
                    window.location.href = post.response.url;
                } else {
                    console.log("POST SHORTLINK ERROR, post: ", post);
                    this.fallBack();
                }
            });
        } catch (e) {
            console.log("POST SHORTLINK ERROR: ", e);
            this.fallBack();
        }
        return (
            <div className="main">
            <center>
                <br/><br/>
                <Icon type="loading" style={{paddingTop:"20px",fontSize: "40px", color: "black"}}/>
            </center>
            </div>
        );
    }


}

export default PostShortlink;