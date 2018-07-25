export const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;

export const httpRegex = /(https?:\/\/[^\s]+)/gi;

export const hedeRefRegex = /\(hede\:\s*([^\)]+)\)/gi;

export const hedeRefRegexInner = /\`([^\`]+)\`/gi;

export const removeHedeReference = /(\<hr\/\>\<em\>Posted\son\s\<a\shref[^\<]*\<\/a\>\<\/em\>\<hr\/\>)/gi;
export const removeHedeReference2 = /(\<hr\/\>\<em\>Posted\son(?:(?!\<\/em\>).)*\<\/em\>\<hr\/\>)/gi;

export default null;
