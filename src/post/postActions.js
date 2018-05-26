import sc2 from '../sc2';
import Promise from 'bluebird';
import { updateEntry, getEntry } from '../actions/entry';


import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';

export const GET_CONTENT = 'GET_CONTENT';
export const GET_CONTENT_START = 'GET_CONTENT_START';
export const GET_CONTENT_SUCCESS = 'GET_CONTENT_SUCCESS';
export const GET_CONTENT_ERROR = 'GET_CONTENT_ERROR';

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';

export const getContent = (postAuthor, postPermlink, afterLike) =>
  (dispatch, getState, { steemAPI }) => {
    if (!postAuthor || !postPermlink) {
      return null;
    }
    return dispatch({
      type: GET_CONTENT,
      payload: {
        promise: steemAPI
          .getContent(postAuthor, postPermlink),
      },
      meta: {
        afterLike,
      },
    });
  };

export const votePost = (postId, author, permlink, weight = 10000) => (dispatch, getState) => {
  const { auth, entries } = getState();
  if (!auth.isAuthenticated) {
    console.log("not logged in to like")

    return null;
  }

  const voter = auth.user.name;
  const entry = find(propEq('id', postId))(entries);

  return dispatch({
    type: LIKE_POST,
    payload: {
      promise: sc2
        .vote(voter, entry.author, entry.permlink, weight)
        .then((res) => {
          if (window.ga) {
            window.ga('send', 'event', 'vote', 'submit', '', 1);
          }

          setTimeout(
            () =>
              dispatch(
                updateEntry(entry.author, entry.permlink)
              ),
            500,
          );
          return res;
        }),
    },
    meta: { postId, voter, weight },
  });
};
