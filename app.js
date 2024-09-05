// Required dependencies
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

// Initialize Koa app
const app = new Koa();

// Initialize Router
const router = new Router();

// Dummy data (in-memory database)
let users = [
  {id: 1, name: 'John Doe'},
  {id: 2, name: 'Jane Smith'}
];

// Middleware
app.use(bodyParser());

// Routes
router.get('/users', async (ctx) => {
  ctx.body = users;
});

router.get('/users/:id', async (ctx) => {
  const user = users.find(u => u.id === parseInt(ctx.params.id));
  if (user) {
    ctx.body = user;
  } else {
    ctx.status = 404;
    ctx.body = {message: 'User not found'};
  }
});

router.post('/users', async (ctx) => {
  const newUser = ctx.request.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  ctx.status = 201;
  ctx.body = newUser;
});

router.post('/health', async (ctx) => {
  ctx.body = {message: 'Server is running'};
});

// Apply router middleware
app.use(router.routes()).use(router.allowedMethods());

// Start the server
const port = 80;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
