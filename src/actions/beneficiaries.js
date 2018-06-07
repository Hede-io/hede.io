import { CALL_API } from '../middlewares/api';
import * as Actions from '../actions/constants';

export const getBeneficiariesRequest = (author) => ({
    [CALL_API]: {
        types: [ Actions.GET_BENEFICIARIES_REQUEST, Actions.GET_BENEFICIARIES_REQUEST, Actions.GET_BENEFICIARIES_REQUEST ],
        endpoint: `beneficiaries?exclude=${author}`,
        schema: null,
        method: 'GET',
        payload: {},
        additionalParams: {},
        absolute: false
    }
});

export const getBeneficiaries = (author) => dispatch => dispatch(getBeneficiariesRequest(author));
