import * as Actions from '../actions/constants';

const titlesLoading = (state = false, action) => {
  switch (action.type) {
    
   
    case Actions.GET_LEFT_TITLES_REQUEST: {
      return true;
    }
    case Actions.GET_LEFT_TITLES_FAILURE:
    case Actions.GET_LEFT_TITLES_SUCCESS:
      return false;

    default: {
      return state;
    }
  }
};

export default titlesLoading;
