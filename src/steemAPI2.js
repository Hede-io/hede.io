/**
 * STEEM Api Wrapper
 *
 * Serves as a wrapper on steem-js' steem.api functions, adding the following features
 *  - automatically return Promises if no callback is passed
 *  - retry if an error occurs
 *  - use WebSocket nodes on default
 *
 * This should be the only file that includes steem-js.
 */

import * as steem from "steem";
const SteemApiS = {
  api: null
}
export const SteemApi = SteemApiS;

const num_retries = 5;
/* List of nodes, borrowed from beem */
const nodes = [
  "https://rpc.steemviz.com",
  "https://rpc.buildteam.io",
  "https://steemd.pevo.science",
  "https://api.steemit.com/",
  "https://steemd.minnowsupportproject.org",
  "https://steemd.privex.io",
  "https://gtg.steem.house:8090",
  "https://rpc.curiesteem.com",
  "https://steemd.steemgigs.org"
];

/* variables to keep track of the currently selected node */
var current_node_index = -1;
var current_node= '';

/**
 * setNextNode
 *
 * Choose the next node from the list of nodes and make it the
 * current node. Is called after an error occured with the
 * current node.
 */
var setNextNode = function() {
  current_node_index = (current_node_index + 1) % nodes.length;
  current_node = nodes[current_node_index];
  steem.api.setOptions({ url: current_node });
  //console.log("Retry with " + current_node);
};


const async_call_names = Object.keys(steem.api)
  .filter(name => name.endsWith("Async"))
  .filter(name => !name.endsWith("WithAsync"));

/**
 * Build a list of wrapper functions on all functions
 * in steem.api, which accept the number of retries
 * as additional parameter. If an error occurs, the
 * current node is changed and the request it performed
 * again (with the number of retries reduced by one).
 * Finally an error is raised, if the number of retries
 * reaches zero.
 * These functions are used in the functions built for
 * the _api list below.
 */
const _retry_calls = [];
async_call_names.forEach(name => {
  const name_without_suffix = name.replace("Async", "");
  var f = function() {
    // no matter what, this function returns a promise,
    // the calling function must deal with the option to
    // have a callback

    // the last parameter is the number of retries
    let fargs = arguments;
    const retries = arguments[arguments.length - 1];
    const try_node = current_node;
    return new Promise((resolve, reject) => {
      const cb = (err, response) => {
        if (err)
          if (retries == 0) return reject(err);
          else {
            fargs[fargs.length - 1] = retries - 1;
            // only change the node, if the current node is still the
            // node, which was current when the Promise was created
            if (try_node == current_node) setNextNode();
            return resolve(
              _retry_calls[name_without_suffix].apply(null, fargs)
            );
          }
        return resolve(response);
      };

      // call the original STEEM API function with the
      // parameters and the callback defined above
      let sargs = fargs;
      sargs[sargs.length - 1] = cb;
      steem.api[name_without_suffix].apply(null, sargs);
    });
  };
  _retry_calls[name_without_suffix] = f;
});

/**
 * Build the final list of api wrappers, which call to the retry
 * functions.
 * All functions automatically return a Promise, if they are called
 * without a callback function.
 */
let _api = [];
async_call_names.forEach(name => {
  const name_without_suffix = name.replace("Async", "");
  var f = function() {
    // return a Promise object, if no callback has been past for
    // the last parameter
    const return_promise =
      arguments.length == 0 ||
      typeof arguments[arguments.length - 1] != "function";
    let fargs = [];
    for (let j = 0; j < arguments.length; j++) fargs[j] = arguments[j];
    if (return_promise) {
      // add the number of retries as parameter
      fargs.push(num_retries);
    } else {
      // replace the callback parameter with the number of retries
      fargs[arguments.length - 1] = num_retries;
    }
    if (return_promise)
      return _retry_calls[name_without_suffix].apply(null, fargs);
    else {
      const cb = arguments[arguments.length - 1];
      _retry_calls[name_without_suffix]
        .apply(null, fargs)
        .then(result => cb(null, result))
        .catch(err => cb(err, null));
    }
  };
  _api[name_without_suffix] = f;
});

/* assign the wrappers to the exported SteemApi class */
//SteemApi.api = _api;


export const formatter1 = steem.formatter;
export const broadcast1 = steem.broadcast;


/* assign the wrappers to the exported SteemApi class */
SteemApiS.api = _api;
//console.log("steem api functions:", _api);

setNextNode();
