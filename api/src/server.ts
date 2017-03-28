const Koa = require('koa');
const koaBody = require('koa-body');
const {adaptAjaxCall} = require('./AjaxAdaptor');

const app = new Koa();

app.use(async function (ctx: KoaContext, next: () => Promise<void>) {
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.use(koaBody());

app.use(async function apiAdaptor(ctx: KoaContext, next: () => Promise<void>) {
    if (ctx.path.indexOf('/ajax/') !== 0) {
        ctx.status = 404;
        ctx.set('content-type', 'application/json');
        ctx.body = JSON.stringify({error: "404 not found"});
    }
    else {
        let method = ctx.path.substr(('/ajax/').length);
        let params = ctx.method === 'POST' ? ctx.request.body : ctx.query;

        console.log(typeof params);
        console.log(params);

        ctx.body = await adaptAjaxCall(method, params);
    }
});

app.listen(3002);
