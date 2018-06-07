
import React from 'react';
import { Link } from 'react-router-dom';

import './EmptyFeed.less';


const Text = ({ type, text }) => {
  
  return (
    <div className="EmptyFeed">
      <span>
        {text}.
      </span>
    </div>
  );
};

const EmptyFeed = ({ type, text }) =>
  (<Text type={type} text={text} />);

export default EmptyFeed;
