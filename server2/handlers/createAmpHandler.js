import url from 'url';
import steemAPI from '../../src/steemAPI';
import renderAmpPage from '../renderers/ampRenderer';

const debug = require('debug')('hede:server');

export default function createAmpHandler(template) {
  return async function ampResponse(req, res) {
    try {
      const result = await steemAPI.getContent(
        req.params.author,
        req.params.permlink,
      );
      if (result.id === 0) return res.sendStatus(404);
      const appUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
      });

      const page = renderAmpPage(result, appUrl, template);
      return res.send(page);
    } catch (error) {
      debug('Error while parsing AMP response', error);
      return res.status(500).send('500 Internal Server Error');
    }
  };
}
