import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router({
  prefix: ''
});

// Middlewares
app.use(cors());
app.use(bodyParser());

// Health check endpoint at root path
router.get('/', async (ctx) => {
  ctx.body = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  };
});

// Basic test route
router.get('/test', async (ctx) => {
  ctx.body = {
    success: true,
    message: 'API is working!'
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});
