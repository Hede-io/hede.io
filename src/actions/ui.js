import { CALL_API } from '../middlewares/api';
import * as Actions from '../actions/constants';


export const setLeftTitlesVisibleRequest = (toDo) => {
  window.leftTitlesVisible < 1? window.leftTitlesVisible = 1 : window.leftTitlesVisible = -1;
  
  return toDo?{
 type: Actions.UI_ACTION_SHOW_TITLES
}:{
  type: Actions.UI_ACTION_HIDE_TITLES
 }
 
};

export const setLeftTitlesVisible = (toDo) => dispatch => dispatch(setLeftTitlesVisibleRequest(toDo));
