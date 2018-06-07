import * as Actions from '../actions/constants';

const stats = (state = {}, action) => {
  switch (action.type) {
    case Actions.GET_STATS_SUCCESS: {
      const states = action.response.stats;
      return states;
    }
    default: {
      return state;
    }
  }
};

export default stats;
