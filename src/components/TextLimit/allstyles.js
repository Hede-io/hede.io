/*
Source: https://stackblitz.com/edit/react-twitter-clone-text-limit?file=allstyles.js
*/

import styled from 'react-emotion';

const ProgressCircle = styled('svg') `
  position: absolute;
  transform: translate(-50%, 0%);
  bottom: 5px;
  right: 10px;
  width: 20px;
  height: 20px;
`;

const OuterCircle = styled('path') `
  stroke: #dbdbdb;
  fill: none;
  stroke-width: 3;
`;

const InnerCircle = styled('path') `
  stroke: ${props => (props.percent < 80)
    ? '#4CC790'
    : (props.percent >= 80 && props.percent < 100)
      ? '#ffad1f'
      : '#f93943'
  // material like low contrast palette
  };
  transition: stroke 0.5s;
  fill: none;
  stroke-width: 3.5;
  stroke-linecap: round;
`;

const StyledDiv = styled('div') `
  display: flex;
  text-align: center;
  padding: 0px;
  border: 0px;
`;

const TextArea = styled('textarea') `
  flex: 1;
  min-width: 200px;
  font-family: Lato, Arial;
  border: none;
  outline: none;
  resize: none;
`;

const InnerDiv = styled('div') `
  flex: 0 0 0px;
  position: relative;
`;

const TextWarn = styled('p') `
  position: absolute;
  top: 100%;
  right: 10px;
  color: ${props => (props.percent < 80)
    ? '#4CC790'
    : (props.percent >= 80 && props.percent < 100)
      ? '#ffad1f'
      : '#f93943'
  };
  transition: color 0.5s;
`;

const PathDescriptor = 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

export { ProgressCircle, OuterCircle, InnerCircle, StyledDiv, TextArea, InnerDiv, PathDescriptor, TextWarn };