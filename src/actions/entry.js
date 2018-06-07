import { CALL_API } from '../middlewares/api';
import * as Actions from '../actions/constants';

export const createEntryRequest = (author, permlink) => ({
  [CALL_API]: {
    types: [ Actions.CREATE_ENTRY_REQUEST, Actions.CREATE_ENTRY_SUCCESS, Actions.CREATE_ENTRY_FAILURE ],
    endpoint: `posts`,
    schema: null,
    method: 'POST',
    payload: {
      author,
      permlink,
    },
    additionalParams: {},
    absolute: false
  }
});

export const createEntry = (author, permlink) => dispatch => dispatch(createEntryRequest(author, permlink));

export const updateEntryRequest = (author, permlink) => ({
  [CALL_API]: {
    types: [ Actions.UPDATE_ENTRY_REQUEST, Actions.UPDATE_ENTRY_SUCCESS, Actions.UPDATE_ENTRY_FAILURE ],
    endpoint: `posts/${author}/${permlink}`,
    schema: null,
    method: 'PUT',
    payload: {
      author,
      permlink,
    },
    additionalParams: {},
    absolute: false
  }
});

export const updateEntry = (author, permlink) => dispatch => dispatch(updateEntryRequest(author, permlink));

export const getEntryRequest = (author, permlink) => ({
  [CALL_API]: {
    types: [ Actions.GET_ENTRY_REQUEST, Actions.GET_ENTRY_SUCCESS, Actions.GET_ENTRY_FAILURE ],
    endpoint: `posts/${author}/${permlink}`,
    schema: null,
    method: 'GET',
    payload: {},
    additionalParams: {},
    absolute: false
  }
});

export const getEntry = (author, permlink) => dispatch => dispatch(getEntryRequest(author, permlink));

export const moderatorActionRequest = (author, permlink, moderator, status) => ({
  [CALL_API]: {
    types: [ Actions.MODERATOR_ACTION_REQUEST, Actions.MODERATOR_ACTION_SUCCESS, Actions.MODERATOR_ACTION_FAILURE ],
    endpoint: `posts/${author}/${permlink}`,
    schema: null,
    method: 'PUT',
    payload: {
      author,
      permlink,
      moderator,
      reviewed: status === 'reviewed' ,
      flagged: status === 'flagged',
      pending: status === 'pending',
    },
    additionalParams: {},
    absolute: false
  }
});

export const moderatorAction = (author, permlink, moderator, status) => dispatch => dispatch(moderatorActionRequest(author, permlink, moderator, status));

export const setEntry = (entry) => ({
  type: Actions.SET_ENTRY,
  payload: entry
});

