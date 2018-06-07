import * as Actions from '../actions/constants';

const loading = (state = false, action) => {
  switch (action.type) {
    
    case Actions.CREATE_ENTRY_REQUEST: {
      return Actions.CREATE_ENTRY_REQUEST;
    }
    case Actions.GET_ENTRIES_REQUEST: {
      return Actions.GET_ENTRIES_REQUEST;
    }
    case Actions.GET_ENTRY_REQUEST: {
      return Actions.GET_ENTRY_REQUEST;
    }
    case Actions.CREATE_ENTRY_REQUEST: {
      return Actions.CREATE_ENTRY_REQUEST;
    }
    case Actions.UPDATE_ENTRY_REQUEST: {
      return Actions.UPDATE_ENTRY_REQUEST;
    }

    case Actions.GET_SPONSORS_REQUEST: {
      return Actions.GET_SPONSORS_REQUEST;
    }
   
    case Actions.VOTE_WITH_SPONSORS_REQUEST: {
      return Actions.VOTE_WITH_SPONSORS_REQUEST;
    }
    case Actions.VOTE_WITH_SPONSORS_SUCCESS:
    case Actions.VOTE_WITH_SPONSORS_FAILURE:

    case Actions.GET_ENTRY_SUCCESS:
    case Actions.GET_ENTRY_FAILURE:
    case Actions.GET_ENTRIES_SUCCESS:
    case Actions.GET_ENTRIES_FAILURE:
    case Actions.CREATE_ENTRY_SUCCESS:
    case Actions.CREATE_ENTRY_FAILURE:
    case Actions.UPDATE_ENTRY_SUCCESS:
    case Actions.UPDATE_ENTRY_FAILURE:
    case Actions.CREATE_SPONSOR_SUCCESS:
    case Actions.UPDATE_ENTRY_SUCCESS:
    case Actions.UPDATE_ENTRY_FAILURE:
    case Actions.SET_ENTRY:

      return false;

    default: {
      return state;
    }
  }
};

export default loading;
