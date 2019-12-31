const Koa = require('koa');
const rq = require('request-promise-native');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const log4js = require('log4js');
const cors = require('kcors');
const config = require('./config');
const app = new Koa();

if (config.api_key === '' || config.api_secret === '') {
  console.log(`Error occured in config: API Key not set`);
  return;
}

log4js.configure({
  appenders: {
    'disqus-proxy': (config.logType === 'file') ? { type: 'file', filename: 'disqusProxy.log' } : { type: 'stdout' }
  },
  categories: {
    default: {
      appenders: ['disqus-proxy'],
      level: 'info'
    }
  },
});

const logger = log4js.getLogger('disqus-proxy');
app.use(bodyParser());
app.use(cors());

const req = {};

let sendRequest = async ({
  task,
  method,
  url,
  form
}) => {
  logger.info(`${task} - Started.`)
  let result;

  try {
    if (method === 'GET') {
      logger.info(`GET ${url}`);
    } else {
      logger.info(`POST ${url}`);
      logger.info(`Form: ${JSON.stringify(form)}`);
    }

    result = await rq(Object.assign(req, {
      method,
      url,
      form,
      json: true,
    }));
    logger.error(`${task} - Success with response code: ${result.code}`);
  } catch (error) {
    result = error.error;
    logger.error(`${task} - Error: ${JSON.stringify(error.error)}`);
  }
  return result;
}

router.get('/api/getThreads', async (ctx) => {
  ctx.body = await sendRequest({
    task: 'List threads',
    method: 'GET',
    url: ['https://disqus.com/api/3.0/threads/list.json?',
      'api_secret=',
      config.api_secret,
      '&forum=',
      config.username,
      '&thread:ident=',
      (config.testPage !== '' ? config.testPage : encodeURIComponent(ctx.request.query.identifier)),
    ].join(''),
  });
});

router.get('/api/listPosts', async (ctx) => {
  ctx.body = await sendRequest({
    task: 'List posts',
    method: 'GET',
    url: ['https://disqus.com/api/3.0/forums/listPosts.json?',
      'api_key=', config.api_key,
      (ctx.request.query.include === undefined) ? '' : ctx.request.query.include.split(',').map((e) => `&include=${e}`).join(''),
      '&forum=', config.username,
      '&limit=', (ctx.request.query.limit === undefined) ? 20 : ctx.request.query.limit
    ].join(''),
  });
});

router.get('/api/getComments', async (ctx) => {
  ctx.body = await sendRequest({
    task: 'List posts',
    method: 'GET',
    url: ['https://disqus.com/api/3.0/threads/listPosts.json?',
      'api_secret=',
      config.api_secret, '&forum=', config.username,
      '&limit=', (ctx.request.query.limit === undefined) ? 100 : ctx.request.query.limit,
      '&thread:ident=',
      (config.testPage !== '' ? config.testPage : encodeURIComponent(ctx.request.query.identifier)),
    ].join(''),
  });
});


router.post('/api/createComment', async (ctx) => {
  ctx.body = await sendRequest({
    task: 'Create Comment',
    method: 'POST',
    url: 'https://disqus.com/api/3.0/posts/create.json',
    form: Object.assign(ctx.request.body, {
      api_key: 'E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F',
      /* fixed private key, for anonymous comments we will always use this key */
    }),
  });
});

router.post('/api/comment/:action', async (ctx) => {
  ctx.body = await sendRequest({
    task: `Comment ${ctx.params.action}`,
    method: 'POST',
    url: `https://disqus.com/api/3.0/posts/${ctx.params.action}.json?`,
    form: Object.assign(ctx.request.body, {
      api_key: config.api_key,
    }),
  });
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.port);

console.log(`Disqus proxy server start at port: ${config.port}`);
console.log('See disqus-proxy.log in current directory.');
logger.info(`Server start at port: ${config.port}`);
