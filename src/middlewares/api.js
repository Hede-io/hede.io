import { get, post, put } from 'superagent';
import merge from 'ramda/src/merge';
import path from 'ramda/src/path';

import Cookie from 'js-cookie';

export const CALL_API = 'CALL_API';
const API_ROOT = process.env.HEDE_API;

function processReq(req, session) {
  if (session) req.set({ session });
  return req.then(res => {
    return res.body;
  }).catch(err => {
    if (err.status === 407 && session) {
      Cookie.remove('session');
      if(typeof window !== "undefined")
        window.location.reload(true);
    }
  })
}

const callApi = (endpoint, schema, method, payload, additionalParams, absolute) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) && !absolute
          ? API_ROOT + endpoint : endpoint;
  
  let session = undefined;
  if (fullUrl.indexOf(API_ROOT) !== -1) {
    session = Cookie.get('session');
  }

  switch (method) {
    case 'GET':
      return processReq(get(fullUrl), session);
    case 'POST':
      return processReq(post(fullUrl).send(payload), session);
    case 'PUT':
      return processReq(put(fullUrl).send(payload), session);
    default:
      return null;
  }
}

export default store => next => action => {
  const callAPI = action[CALL_API]

  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { schema, types, method, payload, additionalParams, absolute } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  // if (!schema) {
  //   throw new Error('Specify one of the exported Schemas.')
  // }

  if (!method) {
    throw new Error('Specify the method.')
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be JSON object.')
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = merge(action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType, additionalParams }))

  return callApi(endpoint, schema, method, payload, additionalParams, absolute).then(
    response => {return next(actionWith({
      response,
      type: successType,
      payload,
      additionalParams,
      absolute
    }))},
    error => {
      const errBody = path(['response', 'text'], error)
      const errResponse = errBody ? JSON.parse(errBody) : {}
      return next(actionWith({
        type: failureType,
        status: error.status,
        error: error.message || 'Something bad happened',
        code: errResponse.code,
        message: errResponse.message,
        errMessage: errResponse.errMessage
      }))
    }
  )
}
