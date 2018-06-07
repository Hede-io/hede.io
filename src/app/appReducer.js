import * as appTypes from './appActions';
import * as authActions from '../auth/authActions';
import * as postActions from '../post/postActions';

const initialState = {
  isFetching: false,
  isLoaded: false,
  locale: 'auto',
  localeLoading: false,
  rate: 0,
  rewardFund: {},
  trendingTopicsLoading: false,
  trendingTopics: [],
  currentMedianHistoryPrice: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        locale: action.payload.user_metadata.locale || initialState.locale,
      };
    case appTypes.GET_LOCALE:
      return {
        ...state,
        locale: action.payload.locale,
      };
    case appTypes.SET_LOCALE_START:
      return {
        ...state,
        localeLoading: true,
      };
    case appTypes.SET_LOCALE_SUCCESS:
      return {
        ...state,
        locale: action.payload,
        localeLoading: false,
      };
    case appTypes.SET_LOCALE_ERROR:
      return {
        ...state,
        localeLoading: false,
      };
    case appTypes.RATE_SUCCESS:
      return {
        ...state,
        rate: action.rate,
      };
    case appTypes.GET_REWARD_FUND_SUCCESS:
      return {
        ...state,
        rewardFund: {
          ...state.rewardFund,
          ...action.payload,
        },
      };
    case postActions.GET_CONTENT_START:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
      };
    case postActions.GET_CONTENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
      };
    case appTypes.GET_TRENDING_TOPICS_START:
      return {
        ...state,
        trendingTopicsLoading: true,
      };
    case appTypes.GET_TRENDING_TOPICS_SUCCESS:
      return {
        ...state,
        trendingTopicsLoading: false,
        trendingTopics: action.payload,
      };
    case appTypes.GET_TRENDING_TOPICS_ERROR:
      return {
        ...state,
        trendingTopicsLoading: false,
        trendingTopics: [],
      };
    case appTypes.GET_CURRENT_MEDIAN_HISTORY_PRICE_SUCCESS:
      return {
        ...state,
        currentMedianHistoryPrice: {
          ...state.currentMedianHistoryPrice,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export const getLocale = state => state.locale;
export const getIsLocaleLoading = state => state.localeLoading;
export const getRate = state => state.rate;
export const getRewardFund = state => state.rewardFund;
export const getIsTrendingTopicsLoading = state => state.trendingTopicsLoading;
export const getTrendingTopics = state => state.trendingTopics;
export const getIsFetching = state => state.isFetching;
export const getCurrentMedianHistoryPrice = state => state.currentMedianHistoryPrice;
