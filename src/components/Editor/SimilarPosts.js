import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { getEntries } from '../../actions/entries';

import './SimilarPosts.less';

@connect(
  state => ({
    entries: state.entries
  }),
  {
    getEntries
  }
)
class SimilarPosts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data && nextProps.data) {
      const data = nextProps.data;
      this.updateEntrys(data.jsonMetadata.type, `${data.title}\n${data.body}`);
    }
  }

  updateEntrys = debounce((type, bySimilarity) => {
    const { getEntries } = this.props;
    getEntries({
      limit: 5,
      skip: 0,
      section: 'all',
      sortBy: 'created',
      type,
      bySimilarity,
      reset: true
    }).then(res => {
      this.setState({
        entries: res.response.results
      })
    })
  }, 10000);

  render() {
    if (!this.state.entries.length) return null;
    return (
      <div className="SimilarPosts">
        <div className="SimilarPosts__container">
          <h4 className="SimilarPosts__title">Found Similar Entries</h4>
          <div className="SimilarPosts__divider_bold"></div>
          <ul>
            {this.state.entries.map(contrib => {
              return (
                <li key={contrib.permlink}>
                  <a href={contrib.url} target="_blank">{contrib.title} - <span className="SimilarPosts__author">@{contrib.author}</span></a>
                  <div className="SimilarPosts__divider"></div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default SimilarPosts;
