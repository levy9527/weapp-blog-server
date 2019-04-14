const Koa = require('koa');
const app = new Koa();
const port = process.env.PORT || 3000

// response
app.use(ctx => {
  if(ctx.path == '/') {
	  ctx.body = 'please request valid path';
		return
	}

  if (ctx.path == '/issue_list') {
	  ctx.body = 'list'
		return
	}

  if (ctx.path == '/issue_detail') {
	  console.log(ctx.body, ctx.query)
	  ctx.body = 'detail'
	}

});

app.listen(port, () => {
  console.log('server start up at http://localhost:' + port)
});
