import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import Icon from 'antd/lib/icon'; 

import CategoryIcon from "../CategoriesIcons/index";
import './Sidenav.less';
import Loading from '../Icon/Loading';

const isActive = (item, match, location) => location.pathname === item;

const Sidenav = ({ loading, topics, location, lang }) =>

  (<div className="SideNavContent">
  
    {loading && <Loading center={false} />}
  
    {!loading &&
    <ul className="Sidenav" style={{listStyleType: 'none'}}>
      {topics.map(topic =>
        <li key={topic.id}>
            <NavLink style={{flex:9}} to={`/${topic.slug}--${topic.id}?o=d${lang!="all"?"&l="+lang : ""}`} activeClassName="Sidenav__item--active" isActive={(match, location) => isActive("/"+topic.slug + '--' + topic.id, match, location)}>
              {topic.name}
            </NavLink>
            <div style={{flex:1}} className="Sidenav__total">{topic.count}</div>
          </li>
        
      )}
    </ul>
    }
  </div>);

Sidenav.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape()),
  maxItems: PropTypes.number,
  loading: PropTypes.bool,

};

Sidenav.defaultProps = {
  topics: undefined,
  maxItems:0,
  loading: true,
};

export default Sidenav;
