import { CALL_API } from '../middlewares/api';
import * as Actions from '../actions/constants';

export const getModeratorsRequest = () => ({
    [CALL_API]: {
        types: [ Actions.GET_MODERATORS_REQUEST, Actions.GET_MODERATORS_SUCCESS, Actions.GET_MODERATORS_FAILURE ],
        endpoint: `moderators`,
        schema: null,
        method: 'GET',
        payload: {},
        additionalParams: {},
        absolute: false
    }
});

export const createModeratorsRequest = (account, referrer) => ({
    [CALL_API]: {
        types: [ Actions.CREATE_MODERATORS_REQUEST, Actions.CREATE_MODERATORS_SUCCESS, Actions.CREATE_MODERATORS_FAILURE ],
        endpoint: `moderators`,
        schema: null,
        method: 'POST',
        payload: {
            account,
            referrer
        },
        additionalParams: {},
        absolute: false
    }
});

export const removeModeratorsRequest = (account) => ({
    [CALL_API]: {
        types: [ Actions.REMOVE_MODERATORS_REQUEST, Actions.REMOVE_MODERATORS_SUCCESS, Actions.REMOVE_MODERATORS_FAILURE ],
        endpoint: `moderators/rm`,
        schema: null,
        method: 'POST',
        payload: {
            account,
        },
        additionalParams: {},
        absolute: false
    }
});

export const getModerators = () => dispatch => dispatch(getModeratorsRequest());
export const createModerator = (account, referrer = "hede-io") => dispatch => dispatch(createModeratorsRequest(account, referrer));
export const removeModerator = (account) => dispatch => dispatch(removeModeratorsRequest(account));
