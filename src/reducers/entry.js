import * as Actions from '../actions/constants';

const entry = (state = {}, action) => {
  switch (action.type) {
    case Actions.GET_ENTRY_SUCCESS: {
      const entry = action.response;
      //console.log("entry found:", entry);
      return entry;
    }
    case Actions.MODERATOR_ACTION_SUCCESS:
    case Actions.UPDATE_ENTRY_SUCCESS: {
      const entry = action.response;
      const stateEntry = state;

      //console.log("updated entry:", entry);
      if(!entry)
        return state;

      if (Object.keys(stateEntry).length && stateEntry.id === entry.id) {
        return entry;
      }
      return {};
    }
    case Actions.CREATE_ENTRY_SUCCESS: {
      const entry = action.response;

      return entry;
    }
    case Actions.SET_ENTRY: {
      const entry = action.payload;
      return entry;
    }
    default: {
      return state;
    }
  }
};

export default entry;