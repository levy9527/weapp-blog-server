require('dotenv').config()
if (!process.env.GITHUB_TOKEN) {
  console.error('请设置环境变量GITHUB_TOKEN')
  return
}

const Koa = require('koa');
const app = new Koa();
const port = process.env.PORT || 3000

const https = require('https')
const fs = require('fs')
const sslOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.pem')
}

const axios = require('axios')
const axiosConfig = {
  method: 'POST',
  url: 'https://api.github.com/graphql',
  headers: {
  	Authorization: 'bearer ' + process.env.GITHUB_TOKEN
  },
}

// response
app.use(async ctx => {
  if(ctx.path == '/') {
	  ctx.body = 'please request valid path';
		return
	}

  if (ctx.path == '/issue_list') {
    let resp = await axios(Object.assign({}, axiosConfig, {
		  data: {
			  "query": "query {\n repository(owner:\"levy9527\", name:\"blog\") {\n issues(first: 50,) {\n edges {\n node {\n title \n url \n number \n}\n}\n}\n}\n rateLimit {\n cost \n remaining \n resetAt \n}\n}"
			}
		}))

	  ctx.body = resp.data.data
		return
	}

  if (ctx.path == '/issue_detail') {
    let resp = await axios(Object.assign({}, axiosConfig, {
			data: {
				"query": "query {\n repository(owner:\"levy9527\", name:\"blog\") {issue(number: " + ctx.query.number + ") {\n bodyHTML \n}\n}\n}"
			},
		}))

	  ctx.body = resp.data.data
	}

});

https.createServer(sslOptions, app.callback()).listen(port, () => {
  console.log('server start up at https://localhost:' + port)
})

