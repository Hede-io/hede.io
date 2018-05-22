//import steem from 'steem';
import {SteemApi, formatter1, broadcast1} from './steemAPI2';

//steem.api.setUri({ uri: process.env.STEEM_NODE });
//steem.api.setWebSocket('wss://steemd-int.steemit.com');
/*steem.config.set('url', 'wss://steemd-int.steemit.com')
steem.config.set('uri', 'wss://steemd-int.steemit.com')
steem.config.set('websocket', 'wss://steemd-int.steemit.com')
steem.config.set('transport', 'ws')
*/

//steem.api.setOptions({ url: process.env.STEEMJS_URL });

//SteemApi.setOptions({ url: process.env.STEEMJS_URL });
/*if(process.env.NODE_ENV === "development"){
    steem.config.set('websocket','wss://testnet.steem.vc')
    steem.config.set('address_prefix', 'STX')
    steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673')
}*/



export const formatter = formatter1;
export const broadcast = broadcast1;

export default SteemApi.api;


//export default steem.api;
