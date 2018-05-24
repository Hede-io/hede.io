import Promise from 'bluebird';
import SteemAPI from '../steemAPI';
import { jsonParse } from '../helpers/formatter';

/** *
 * Get the path from URL and the API object of steem and return the correct API call based on path
 * @param path - as in URL like 'trending'
 * @param API - the { api } from steem npm package
 * @param query {Object} - the same query sending to Steem API
 * @param steemAPI - The same giving to Steem API
 * @returns {function}
 */
export const getDiscussionsFromAPI = function getDiscussionsFromAPI(sortBy, originalQuery, steemAPI) {
  // @TODO this is hacky to say the least. Requires full refactoring
  // @HEDE filtered query
  let query;
  query = {
    ...originalQuery,
    ["select_tags"]: [process.env.HEDE_CATEGORY],
  };
  console.log("SORT BY", sortBy);

  switch (sortBy) {
    /*
    case 'feed':
      console.log("BY FEED")
      return steemAPI.getDiscussionsByFeedAsync(query);
      */
    case 'topic':
      console.log("BY TOPIC");
      query = {
        tag: originalQuery.tag,
        limit: 10,
        ["select_tags"]: [process.env.HEDE_CATEGORY],
      };
      return steemAPI.getDiscussionsByTrending(query);
    case 'hot':
      console.log("BY HOT")
      query.tag = process.env.HEDE_CATEGORY; // @HEDE filtered query
      return steemAPI.getDiscussionsByHot(query);
    case 'created':
      console.log("BY CREATED")
      query.tag = process.env.HEDE_CATEGORY; // @HEDE filtered query
      return steemAPI.getDiscussionsByCreated(query);
    case 'active':
      console.log("BY ACTIVE")
      query.tag = process.env.HEDE_CATEGORY; // @HEDE filtered query
      return steemAPI.getDiscussionsByActive(query);
    case 'trending':
      console.log("BY TRENDING", query)
      query.tag = process.env.HEDE_CATEGORY; // @HEDE filtered query
      return steemAPI.getDiscussionsByTrending(query);
    case 'blog':
      console.log("BY BLOG", query)
      return steemAPI.getDiscussionsByBlog(query);
    /*case 'comments':
      return steemAPI.getDiscussionsByCommentsAsync(query);
      */
    case 'promoted':
      console.log("BY PROMOTED")
      query.tag = process.env.HEDE_CATEGORY; // @HEDE filtered query
      return steemAPI.getDiscussionsByPromoted(query);
    default:
      throw new Error('There is not API endpoint defined for this sorting');
  }
};

export const getAccount = username =>
  SteemAPI.getAccounts([username]).then((result) => {
    if (result.length) {
      const userAccount = result[0];
      userAccount.json_metadata = jsonParse(result[0].json_metadata);
      return userAccount;
    }
    throw new Error('User Not Found');
  });

export const getFollowingCount = username => SteemAPI.getFollowCount(username);

export const getAccountWithFollowingCount = username =>
  Promise.all([
    getAccount(username),
    getFollowingCount(username),
  ]).then(([account, { following_count, follower_count }]) => ({
    ...account,
    following_count,
    follower_count,
  }));

export const getFollowing = (username, startForm = '', type = 'blog', limit = 100) =>
  SteemAPI.getFollowing(username, startForm, type, limit).then(result =>
    result.map(user => user.following),
  );

export const getFollowers = (username, startForm = '', type = 'blog', limit = 100) =>
  SteemAPI.getFollowers(username, startForm, type, limit).then(result =>
    result.map(user => user.follower),
  );

export const getAllFollowing = username =>

  getFollowingCount(username).then(res=>{
      const followingCount = res['following_count'];
      const chunkSize = 100;
      const limitArray = Array.fill(Array(Math.ceil(followingCount / chunkSize)), chunkSize);
      return Promise.reduce(
        limitArray,
        (currentList, limit) => {
          const startForm = currentList[currentList.length - 1] || '';
          return getFollowing(username, startForm, 'blog', limit).then(following =>
            currentList.slice(0, currentList.length - 1).concat(following),
          );
        },
        [],
      );
  });
  

export const getAllFollowers = username =>
  getFollowingCount(username).then(res=>{
    const followerCount = res['follower_count'];
      const chunkSize = 100;
      const limitArray = Array.fill(Array(Math.ceil(followerCount / chunkSize)), chunkSize);
      return Promise.reduce(
        limitArray,
        (currentList, limit) => {
          const startForm = currentList[currentList.length - 1] || '';
          return getFollowers(username, startForm, 'blog', limit).then(following =>
            currentList.slice(0, currentList.length - 1).concat(following),
          );
        },
        [],
      );
    });

export const mapToId = (content) => {
  const listById = {};
  Object.values(content).forEach((value) => {
    listById[value.id] = value;
  });
  return listById;
};

export const mapAPIContentToId = apiRes => mapToId(apiRes.content);
