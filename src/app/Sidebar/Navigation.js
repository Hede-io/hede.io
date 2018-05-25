import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAuthenticatedUser, getIsTrendingTopicsLoading, getTrendingTopics } from '../../reducers';
import { FormattedMessage } from 'react-intl';

import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';
import {getLeftTitles} from "../../actions/titles";
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import Pagination from 'antd/lib/pagination';

const Option = Select.Option;

//let totalTitles = 0;

let filterLanguage = "all";
let currentPage = 1, perPage = 50;

const getLastTitles = (getLeftTitles)=>{
  currentPage = 1;

  getLeftTitles({
    limit:perPage,
    skip:0,
    section: 'all',
    sortBy: 'created',
    type: 'all',
    reset: true,
    l: filterLanguage || 'all',
    tag:"tag1,tag2",
  }).then(res=>{
    //totalTitles = res.response.total;
    //this.setState({skip: skip + limit});
  });
}

const handleChange = (t,v,f)=>{
  filterLanguage = v;

  f({
    limit:perPage,
    skip:0,
    section: 'all',
    sortBy: 'created',
    type: 'all',
    reset: true,
    l: v,
    tag:"tag1,tag2",
  }).then(res=>{
    //totalTitles = res.response.total;
    //this.setState({skip: skip + limit});
  });
}

const onPageChange = (p, s, f) => {
  perPage = s;
  currentPage = p;

  f({
    limit:s,
    skip:(p-1)*s,
    section: 'all',
    sortBy: 'created',
    type: 'all',
    reset: true,
    l: filterLanguage || 'all',
    tag:"tag1,tag2",
  }).then(res=>{
    //totalTitles = res.response.total;
    //this.setState({skip: skip + limit});
  });
}

const Navigation = ({ authenticatedUser, loading, titles, getLeftTitles, totalTitles }) => {
  return (
  <div>
    <h4 className="topicHeader" style={{marginBottom:10}}>
        <FormattedMessage id={'last_topics'} defaultMessage={'Hot Topics - This Week'} />
    </h4>
    <Button style={{marginBottom:5, flex:1, width:"100%", marginRight:5, borderWidth: 0}} key="getLastTitles" onClick={()=>getLastTitles(getLeftTitles)}>REFRESH</Button>

    <Select
        style={{ width: "100%", marginBottom:5, marginRight: 5 }}
        placeholder="All languages"
        optionFilterProp="children"
        onChange={val => handleChange("language", val, getLeftTitles)}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        <Option value="all">All languages</Option>
        <Option value="en">English</Option>
        <Option value="ar">Arabic</Option>
        <Option value="az">Azerbaijani</Option>
        <Option value="id">Bahasa</Option>
        <Option value="cn">Chinese</Option>
        <Option value="nl">Dutch</Option>
        <Option value="de">German</Option>
        <Option value="fr">French</Option>
        <Option value="it">Italian</Option>
        <Option value="kr">Korean</Option>
        <Option value="pl">Polish</Option>
        <Option value="pt">Portugese</Option>
        <Option value="ru">Russian</Option>
        <Option value="es">Spanish</Option>
        <Option value="th">Thai</Option>
        <Option value="tr">Turkish</Option>

      </Select>
    <Sidenav username={authenticatedUser.name} loading={loading} topics={titles} lang={filterLanguage || "all"} />
    <Pagination size="small" style={{marginBottom:10}} defaultCurrent={1} current={currentPage} total={totalTitles} onChange={(page, pageSize)=>onPageChange(page, pageSize, getLeftTitles)} pageSize={perPage} />

    {/*<Topics loading={trendingTopicsLoading} topics={trendingTopics} />*/}
  </div>
)};

Navigation.propTypes = {
  authenticatedUser: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  titles: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  totalTitles: PropTypes.number.isRequired
};

export default connect(
  state => ({
    authenticatedUser: getAuthenticatedUser(state),
    loading: state.leftTitlesLoading,
    titles: state.leftTitles,
    totalTitles: state.totalTitles
  }),
  {
    getLeftTitles
  },
)(Navigation);
