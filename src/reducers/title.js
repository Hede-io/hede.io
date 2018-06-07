import * as Actions from '../actions/constants';

const title = (state = {}, action) => {
  switch (action.type) {
    
    case Actions.GET_ENTRIES_SUCCESS: {
        const title = action.response.title;
        //console.log("title reducer action:", action);
        if(typeof title === "undefined")
          return null;

        return title;
    }
   
    default: {
      return state;
    }
  }
};

export default title;

