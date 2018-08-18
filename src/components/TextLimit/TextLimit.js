/*
Source: https://stackblitz.com/edit/react-twitter-clone-text-limit?file=textlimit.js
Updated by @ercu to make it work with Antd Input
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/lib/input'; 
import findDOMNode from 'react-dom/lib/findDOMNode';

import { ProgressCircle, OuterCircle, InnerCircle, StyledDiv, TextArea, InnerDiv, PathDescriptor, TextWarn } from './allstyles'

class TextLimit extends Component {
  state = {
    value: '',
    percent: 0
  };

  constructor(props){
    super(props);
    this.input = null;
  }

  handleChange = (e, type = null) => {

    let value = this.input.value;
    this.setState({
        value,
        percent: value? Math.floor((value.length * 100) / this.props.maxLength) : 0
      });
    
    if(this.props.onChange)
      this.props.onChange(e, type);
    
  };

  setRef = input =>{
    if(this.input)
      return;


    if (input && input.refs && input.refs.input) {
      this.originalInput = input.refs.input;
      // eslint-disable-next-line react/no-find-dom-node
      this.input = findDOMNode(input.refs.input);
    }
    this.props.inputRef(this.input);

  }

  render() {
    let allProps = {...this.props};
    delete allProps["limit"];
    delete allProps["inputRef"];
    delete allProps["maxLength"];
    
    return (
      <StyledDiv>
        <Input ref={r=>this.setRef(r)} {...allProps} onChange={this.handleChange}/>
        <InnerDiv>
         
          <ProgressCircle viewBox="0 0 36 36">
            <OuterCircle
              strokeDasharray="100, 100"
              d={`${PathDescriptor}`}
            />
            {this.state.value && <InnerCircle className={this.s}
              percent={this.state.percent}
              strokeDasharray={`${this.state.percent}, 100`}
              d={`${PathDescriptor}`}
            />}
          </ProgressCircle>
          <TextWarn percent={this.state.percent}>
            {this.state.percent >= 80 && this.props.maxLength - this.state.value.length}
          </TextWarn>
        </InnerDiv>
      </StyledDiv>
    );
  }
}

TextLimit.defaultProps = {
  maxLength: 10,
  rows: 3,
  inputRef: null,
  onChange: (e,t)=>{}
};

TextLimit.propTypes = {
  maxLength: PropTypes.number,
  rows: PropTypes.number,
  inputRef: PropTypes.func,
  onChange: PropTypes.func
}

export default TextLimit;