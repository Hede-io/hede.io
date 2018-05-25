import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Button from 'antd/lib/button';  
import Tooltip from 'antd/lib/tooltip';  
import Menu from 'antd/lib/menu';  
import Dropdown from 'antd/lib/dropdown';  
import Icon  from 'antd/lib/icon';  

import './EditorToolbar.less';

const tooltip = (description, shortcut) =>
  (<span>
    {description}
    <br />
    <b>
      {shortcut}
    </b>
  </span>);

const EditorToolbar = ({ intl, onSelect }) => {
  const menu = (
    <Menu onClick={e => onSelect(e.key)}>
      <Menu.Item key="h1"><h1>Heading 1</h1></Menu.Item>
      <Menu.Item key="h2"><h2>Heading 2</h2></Menu.Item>
      <Menu.Item key="h3"><h3>Heading 3</h3></Menu.Item>
      <Menu.Item key="h4"><h4>Heading 4</h4></Menu.Item>
      <Menu.Item key="h5"><h5>Heading 5</h5></Menu.Item>
      <Menu.Item key="h6"><h6>Heading 6</h6></Menu.Item>
    </Menu>
  );

  return (
    <div className="EditorToolbar">
      <Tooltip title={tooltip(intl.formatMessage({ id: 'link', defaultMessage: 'Add link' }), 'Ctrl+k')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('link')}>
          <Icon type="link"/>
        </Button>
      </Tooltip>

      <Tooltip title={tooltip(intl.formatMessage({ id: 'innerLink', defaultMessage: 'Inner reference to topic' }), 'Ctrl+h')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('innerlink')}>
          `Hede`
        </Button>
      </Tooltip>

      <Tooltip title={tooltip(intl.formatMessage({ id: 'seeAlsoLink', defaultMessage: 'Reference to topic' }), 'Ctrl+j')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('seealso')}>
          (Hede:)
        </Button>
      </Tooltip>

      <Tooltip title={tooltip(intl.formatMessage({ id: 'quote', defaultMessage: 'Add quote' }), 'Ctrl+q')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('q')}>
          <i className="iconfont icon-q1" />
        </Button>
      </Tooltip>

      <Tooltip title={tooltip(intl.formatMessage({ id: 'image', defaultMessage: 'Add image' }), 'Ctrl+m')}>
        <Button className="EditorToolbar__button" onClick={() => onSelect('image')}>
          <i className="iconfont icon-picture" />
        </Button>
      </Tooltip>

    </div>
  );
};

EditorToolbar.propTypes = {
  intl: PropTypes.shape().isRequired,
  onSelect: PropTypes.func,
};

EditorToolbar.defaultProps = {
  onSelect: () => {},
};

export default injectIntl(EditorToolbar);
