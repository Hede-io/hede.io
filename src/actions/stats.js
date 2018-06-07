import { CALL_API } from '../middlewares/api';
import * as Actions from '../actions/constants';

export const getStatsRequest = () => ({
    [CALL_API]: {
        types: [ Actions.GET_STATS_REQUEST, Actions.GET_STATS_SUCCESS, Actions.GET_STATS_FAILURE ],
        endpoint: `stats`,
        schema: null,
        method: 'GET',
        payload: {},
        additionalParams: {},
        absolute: false
    }
});

export const getStats = () => dispatch => dispatch(getStatsRequest());
