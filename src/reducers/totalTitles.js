import * as Actions from '../actions/constants';

const totalTitles = (state = 0, action) => {
  switch (action.type) {
    case Actions.GET_LEFT_TITLES_SUCCESS: {
      return action.response.total;
    }
   
    default: {
      return state;
    }
  }
};

export default totalTitles;
