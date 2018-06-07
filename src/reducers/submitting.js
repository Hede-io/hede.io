import * as Actions from '../actions/constants';

const submitting = (state = false, action) => {
  switch (action.type) {
    
    case Actions.CREATE_ENTRY_REQUEST: {
      return Actions.CREATE_ENTRY_REQUEST;
    }
    
    case Actions.UPDATE_ENTRY_REQUEST: {
      return Actions.UPDATE_ENTRY_REQUEST;
    }

    case Actions.CREATE_ENTRY_SUCCESS:
    case Actions.CREATE_ENTRY_FAILURE:
    case Actions.UPDATE_ENTRY_SUCCESS:
    case Actions.UPDATE_ENTRY_FAILURE:
        return false;
        
    default: {
      return state;
    }
  }
};

export default submitting;
