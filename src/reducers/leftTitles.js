import * as Actions from '../actions/constants';

import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

const leftTitles = (state = [], action) => {
  switch (action.type) {
    case Actions.GET_LEFT_TITLES_SUCCESS: {
      const titles = state;
      const reset = action.additionalParams.reset;
      const newTitles = action.response.results;

      if (reset) {
        return newTitles;
      }

      return [
        ...titles,
        ...newTitles.filter(title => !find(propEq('id', title.id))(titles)),
      ];
    }
    case Actions.GET_LEFT_TITLE_SUCCESS: {
      const title = action.response;
      const titles = state;

      if (!find(propEq('id', title.id))(titles)) {
        return [
          ...titles,
          title
        ];
      }

      return titles.map(stateTitle => {
        if (stateTitle.id === title.id) {
          return title;
        }
        return stateTitle;
      })
    }
   
    default: {
      return state;
    }
  }
};

export default leftTitles;
