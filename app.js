// Required dependencies
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const {DynamoDBClient, PutItemCommand} = require('@aws-sdk/client-dynamodb');
const {marshall} = require('@aws-sdk/util-dynamodb');

// Initialize Koa app
const app = new Koa();

// Initialize Router
const router = new Router();

// Dummy data (in-memory database)
let users = [
  {id: 1, name: 'John Doe'},
  {id: 2, name: 'Jane Smith'}
];

const dynamoClient = new DynamoDBClient({
  region: 'ap-southeast-2'
});

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

router.get('/health', async (ctx) => {
  ctx.body = {message: 'Server is running'};
});
router.get('/', async (ctx) => {
  ctx.body = {message: 'Server is running'};
});

router.get('/items', async (ctx) => {
  try {
    // 示例数据结构
    const item = {
      id: Date.now().toString(),

    };

    const params = {
      TableName: 'items',
      Item: marshall(item)
    };

    const command = new PutItemCommand(params);
    await dynamoClient.send(command);

    ctx.body = {
      success: true,
      message: '',
      data: item
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'update data failed',
      error: error.message
    };
  }
});

// Apply router middleware
app.use(router.routes()).use(router.allowedMethods());

// Start the server
const port = 80;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
