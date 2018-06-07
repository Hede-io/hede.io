import Promise from 'bluebird';
import Cookie from 'js-cookie';
import { getFollowing } from '../user/userActions';
import { initPushpad } from '../helpers/pushpadHelper';
import { getDrafts } from '../helpers/localStorageHelpers';
import getImage from '../helpers/getImage';
import * as request from 'superagent';
import sc2 from '../sc2';

export const LOGIN = '@auth/LOGIN';
export const LOGIN_START = '@auth/LOGIN_START';
export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGIN_ERROR = '@auth/LOGIN_ERROR';

export const RELOAD = '@auth/RELOAD';
export const RELOAD_START = '@auth/RELOAD_START';
export const RELOAD_SUCCESS = '@auth/RELOAD_SUCCESS';
export const RELOAD_ERROR = '@auth/RELOAD_ERROR';

export const LOGOUT = '@auth/LOGOUT';
export const LOGOUT_START = '@auth/LOGOUT_START';
export const LOGOUT_ERROR = '@auth/LOGOUT_ERROR';
export const LOGOUT_SUCCESS = '@auth/LOGOUT_SUCCESS';

export const login = () => (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: {
      promise: sc2.profile()
        .then((resp) => {
          // console.log("RESP", resp)

          if (resp && resp.user) {
            dispatch(getFollowing(resp.user));

          }

          if (window.ga) {
            window.ga('set', 'userId', resp.user);
          }

          //initPushpad(resp.user, Cookie.get('access_token'));
          resp.drafts = getDrafts();
          return resp;
        })
    }
  });
};

export const reload = () => dispatch =>
  dispatch({
    type: RELOAD,
    payload: {
      promise: sc2.profile()
    }
  });

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
    payload: {
      promise: request
        .get(process.env.HEDE_API + 'logout')
        .set({ session: Cookie.get('session') })
        .then(() => {
          Cookie.remove('session');
          if (process.env.NODE_ENV === 'production') {
            window.location.href = process.env.HEDE_LANDING_URL;
          }
        })
    }
  });
};
