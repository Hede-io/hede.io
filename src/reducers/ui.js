import * as Actions from '../actions/constants';

const uiView = (state = 0, action) => {
  switch (action.type) {
    case Actions.UI_ACTION_SHOW_TITLES: {
      return 1;
    }
    
    case Actions.UI_ACTION_HIDE_TITLES: {
      return -1;
    }
   
    default: {
      return 0;
    }
  }
};

export default uiView;
