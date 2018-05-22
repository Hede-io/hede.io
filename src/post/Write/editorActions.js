import Promise from 'bluebird';
import assert from 'assert';
import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';
import { addDraftLocaleStorage, deleteDraftLocaleStorage } from '../../helpers/localStorageHelpers';
import { jsonParse } from '../../helpers/formatter';
import { createPermlink, getBodyPatchIfSmaller } from '../../vendor/steemitHelpers';

import { createEntry, updateEntry } from '../../actions/entry';
import sc2 from '../../sc2';

export const CREATE_POST = '@editor/CREATE_POST';
export const CREATE_POST_START = '@editor/CREATE_POST_START';
export const CREATE_POST_SUCCESS = '@editor/CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = '@editor/CREATE_POST_ERROR';

export const NEW_POST = '@editor/NEW_POST';
export const newPost = createAction(NEW_POST);

export const SAVE_DRAFT = '@editor/SAVE_DRAFT';
export const SAVE_DRAFT_START = '@editor/SAVE_DRAFT_START';
export const SAVE_DRAFT_SUCCESS = '@editor/SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_ERROR = '@editor/SAVE_DRAFT_ERROR';

export const DELETE_DRAFT = '@editor/DELETE_DRAFT';
export const DELETE_DRAFT_START = '@editor/DELETE_DRAFT_START';
export const DELETE_DRAFT_SUCCESS = '@editor/DELETE_DRAFT_SUCCESS';
export const DELETE_DRAFT_ERROR = '@editor/DELETE_DRAFT_ERROR';

export const ADD_EDITED_POST = '@editor/ADD_EDITED_POST';
export const addEditedPost = createAction(ADD_EDITED_POST);

export const DELETE_EDITED_POST = '@editor/DELETE_EDITED_POST';
export const deleteEditedPost = createAction(DELETE_EDITED_POST);
import { slug } from '../../vendor/steemitHelpers';
import { removeHedeReference2 } from '../../helpers/regexHelpers';

export const saveDraft = (post, redirect) => dispatch =>
  dispatch({
    type: SAVE_DRAFT,
    payload: {
      promise: addDraftLocaleStorage(post)
        .then((resp) => {
          if (redirect) {
            if (post.repoId && post.type === 'task') {
              dispatch(push(`/write-task/${post.repoId}/?draft=${post.id}`));
            } else {
              dispatch(push(`/write?draft=${post.id}`));
            }

          }
          return resp;
        }),
    },
    meta: { postId: post.id },
  });

export const deleteDraft = draftId => (dispatch) => {
  dispatch({
    type: DELETE_DRAFT,
    payload: {
      promise: deleteDraftLocaleStorage(draftId),
    },
    meta: { id: draftId },
  });
};

export const editPost = post => (dispatch) => {
  const jsonMetadata = jsonParse(post.json_metadata);
  const draft = {
    ...post,
    originalBody: post.body.replace(removeHedeReference2, "").replace(/<br\s?\/\>\s*$/, ""),
    jsonMetadata,
    isUpdating: true,
  };
  dispatch(saveDraft({ postData: draft, id: post.id }))
    .then(() => {
        dispatch(push(`/write?draft=${post.id}`));   
    });
};

const requiredFields = 'parentAuthor,parentPermlink,author,permlink,title,body,jsonMetadata'.split(
  ',',
);

export const broadcastComment = (
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  permlink,
  reward,
  extensions,
) => {
  const operations = [];

  const commentOp = [
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ];
  operations.push(commentOp);

  //console.log("commentOp", commentOp);

  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    extensions,
  };

  // @HEDE here beneficiaries are stored when creating the post
  if (extensions) {
    commentOptionsConfig.extensions = extensions;

    if (reward === '100') {
      commentOptionsConfig.percent_steem_dollars = 0;
    } else {
      commentOptionsConfig.percent_steem_dollars = 10000;
    }

    commentOptionsConfig.max_accepted_payout = '1000000.000 SBD';

    operations.push(['comment_options', commentOptionsConfig]);
  }

  console.log("OPERATIONS", operations)

  return sc2.broadcast(operations).catch(e => {
    if (commentOp) console.log("ORIGINAL COMMENT OBJECT: ", commentOp);
    alert("Hede could not connect to Steem. Please try again in few minutes.");
  });
};

export function createPost(postData) {
  requiredFields.forEach((field) => {
    assert(postData[field] != null, `Developer Error: Missing required field ${field}`);
  });

  return (dispatch) => {
    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      body,
      jsonMetadata,
      reward,
      draftId,
      isUpdating,
      extensions,
    } = postData;

    //console.log("POST DATA", postData);

    const getPermLink = isUpdating
      ? Promise.resolve(postData.permlink)
      : createPermlink(title, author, parentAuthor, parentPermlink);

    dispatch({
      type: CREATE_POST,
      payload: {
        promise: getPermLink.then(permlink => {
            //const newBody = isUpdating ? getBodyPatchIfSmaller(postData.originalBody, body) : body + `\n\n<br /><hr/><em>Posted on <a href="https://hede.io/${process.env.HEDE_CATEGORY}/@${author}/${permlink}">Hede.io -  Knowledge Sharing Dictionary </a></em><hr/>`;

            const newBody = body + `\n\n<hr/><em>Posted on <a href="https://hede.io">Hede.io -  Knowledge Sharing Dictionary </a><br/> Read <a href="https://hede.io/${process.env.HEDE_CATEGORY}/@${author}/${permlink}">this entry</a> or <a href="https://hede.io/${slug(jsonMetadata.title)}--${jsonMetadata.titleId}">all entries about ${jsonMetadata.title}.</a></em><hr/>`;
            return broadcastComment(
              parentAuthor,
              parentPermlink,
              author,
              title,
              newBody,
              jsonMetadata,
              permlink,
              !isUpdating && reward,
              !isUpdating && extensions,
            ).then(result => {

              if (result) {

                if (draftId) {
                  dispatch(deleteDraft(draftId));
                  dispatch(addEditedPost(permlink));
                }

                // @HEDE
                if (!isUpdating) {
                  const createOnAPI = entryData => dispatch(
                    createEntry(entryData.author, entryData.permlink)
                  );

                  createOnAPI({ author, permlink }).then(() => {
                    dispatch(push(`/${parentPermlink}/@${author}/${permlink}`));
                  })

                } else {
                  const updateOnAPI = entryData => dispatch(
                    updateEntry(entryData.author, entryData.permlink)
                  );
                  updateOnAPI({ author, permlink }).then(() => dispatch(
                    push(`/${parentPermlink}/@${author}/${permlink}`)
                  ));
                }

                if (window.ga) {
                  window.ga('send', 'event', 'post', 'submit', '', 10);
                }

                return result;
              }
            })
          }
        ),
      },
    });
  };
}
