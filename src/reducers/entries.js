import * as Actions from '../actions/constants';

import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

const entries = (state = [], action) => {
  switch (action.type) {
    case Actions.GET_ENTRIES_REQUEST:{
      const reset = action.additionalParams.reset;

      if (reset) {
        return [];
      }

      return state;
    }
    case Actions.GET_ENTRIES_SUCCESS: {
      const entries = state;
      const reset = action.additionalParams.reset;
      const newEntrys = action.response.results;

      //console.log("newEntries:", newEntrys);

      if (reset) {
        return newEntrys;
      }
     
      return [
        ...entries,
        ...newEntrys.filter(entry => !find(propEq('_id', entry._id))(entries)),
      ];
    }
    case Actions.MODERATOR_ACTION_SUCCESS:
    case Actions.UPDATE_ENTRY_SUCCESS:
    case Actions.GET_ENTRY_SUCCESS: {
      const entry = action.response;
      //return [entry];

      const entries = state;
      //console.log("entry success: ", entry);
      if(!entry)
        return state;
        
      if (!find(propEq('id', entry.id))(entries)) {
        return [
          ...entries,
          entry,

        ];
      }

      return entries.map(stateEntry => {
        if (stateEntry.id === entry.id) {
          return entry;
        }
        return stateEntry;
      })
    }
    case Actions.CREATE_ENTRY_SUCCESS: {
      const entry = action.response;
      const entries = state;

      return [
        ...entries,
        entry
      ];
    }
    case Actions.SET_ENTRIES: {
      const entries = action.payload;
      return entries;
    }
    default: {
      return state;
    }
  }
};

export default entries;