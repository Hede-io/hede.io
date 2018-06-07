import { CALL_API } from '../middlewares/api';
import * as Actions from '../actions/constants';
import * as querystring from 'querystring';

export const getTitlesRequest = query => ({
    [CALL_API]: {
        types: [ Actions.GET_TITLES_REQUEST, Actions.GET_TITLES_SUCCESS, Actions.GET_TITLES_FAILURE ],
        endpoint: `titles/list/?${querystring.encode(query)}`,
        schema: null,
        method: 'GET',
        payload: {},
        additionalParams: {
          reset: query.reset || false
        },
        absolute: false
    }
});

export const getTitles = query => dispatch => dispatch(getTitlesRequest(query));


export const getLeftTitlesRequest = query => ({
    [CALL_API]: {
        types: [ Actions.GET_LEFT_TITLES_REQUEST, Actions.GET_LEFT_TITLES_SUCCESS, Actions.GET_LEFT_TITLES_FAILURE ],
        endpoint: `titles/last/?${querystring.encode(query)}`,
        schema: null,
        method: 'GET',
        payload: {},
        additionalParams: {
          reset: query.reset || false
        },
        absolute: false
    }
});

export const getLeftTitles = query => dispatch => dispatch(getLeftTitlesRequest(query));


export const searchTitlesRequest = query => ({
    [CALL_API]: {
        types: [ Actions.SEARCH_TITLES_REQUEST, Actions.SEARCH_TITLES_SUCCESS, Actions.SEARCH_TITLES_FAILURE ],
        endpoint: `titles/search/?${querystring.encode(query)}`,
        schema: null,
        method: 'GET',
        payload: {},
        additionalParams: {
          reset: query.reset || false
        },
        absolute: false
    }
});

export const searchTitles = query => dispatch => dispatch(searchTitlesRequest(query));
