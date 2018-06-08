[Hede.io](https://hede.io) is the first Steem Interface letting authors to create collaborative Wikis on Steem and contribute to them with their posts. Because of the nature of steem, people can not change others' posts so it makes creating one big chunk of text based wikis not suitable for Steem. On Hede we solved this by letting each topic consisting of multiple posts(entries). 
Information shared does not need to be correct and might even contain subjective opinions. We encourage authors to share their experience based knowledge on hede.

This interface has been requested by many people for being open sourced.

Clone and Install
------------------
git clone https://github.com/hede-io/hede.io hede.io

cd hede.io

npm install

export SERVER_SSL_CERT="/path_to_hede.io/cert.pem"

export SERVER_SSL_KEY="/path_to_hede.io/key.pem"

export NODE_TLS_REJECT_UNAUTHORIZED=0

npm run dev-server

Server App
-----------------------
This app connects to caching/search server between client and blockchain, and the server allows any domain to send request (CORS Allowed all). After cleanup, removing security keys and make it installable, the server will also be open sourced.

Forked from https://github.com/busyorg/busy, and https://github.com/utopian-io/utopian.io Hede uses the [STEEM Blockchain](https://steem.io) to let users reward authors who shares their knowledge.

To see it alive [click here:](https://hede.io)
