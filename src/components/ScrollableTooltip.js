
import React from 'react';
import Tooltip from 'antd/lib/tooltip';

class ScrollableTooltip extends Tooltip {

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    this.setState({ visible: false });
    this.getPopupDomNode();
  }
}

export default ScrollableTooltip;
