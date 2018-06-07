import Promise from 'bluebird';
import omit from 'lodash/omit';
import sc2 from '../sc2';

const getMetadata = () => sc2.profile().then(resp => resp.user_metadata);

export const saveSettingsMetadata = settings =>
  getMetadata()
    .then(metadata =>
      sc2.updateMetadata({
        ...metadata,
        settings: {
          ...metadata.settings,
          ...settings,
        },
      }),
    )
    .then(resp => resp.user_metadata.settings);

export const setLocaleMetadata = locale =>
  getMetadata()
    .then(metadata =>
      sc2.updateMetadata({
        ...metadata,
        locale,
      }),
    )
    .then(resp => resp.user_metadata.locale);

export const addDraftMetadata = draft =>
  getMetadata()
    .then(metadata =>
      sc2.updateMetadata({
        ...metadata,
        drafts: {
          ...metadata.drafts,
          [draft.id]: draft.postData,
        },
      }),
    )
    .then(resp => resp.user_metadata.drafts[draft.id]);

export const deleteDraftMetadata = draftId =>
  getMetadata()
    .then(metadata =>
      sc2.updateMetadata({
        ...metadata,
        drafts: omit(metadata.drafts, draftId),
      }),
    )
    .then(resp => resp.user_metadata.drafts);

export const toggleBookmarkMetadata = (id, author, permlink) =>
  getMetadata()
    .then(metadata =>
      sc2.updateMetadata({
        ...metadata,
        bookmarks:
          metadata.bookmarks && metadata.bookmarks[id]
            ? omit(metadata.bookmarks, id)
            : { ...metadata.bookmarks, [id]: { id, author, permlink } },
      }),
    )
    .then(resp => resp.user_metadata.bookmarks);

export default getMetadata;
