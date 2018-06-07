import { CALL_API } from '../middlewares/api';
import * as Actions from '../actions/constants';

export const createSponsorRequest = (sponsor) => ({
  [CALL_API]: {
    types: [ Actions.CREATE_SPONSOR_REQUEST, Actions.CREATE_SPONSOR_SUCCESS, Actions.CREATE_ENTRY_FAILURE ],
    endpoint: `sponsors`,
    schema: null,
    method: 'POST',
    payload: {
      sponsor,
    },
    additionalParams: {},
    absolute: false
  }
});

export const createSponsor = account => dispatch => dispatch(createSponsorRequest(account));
