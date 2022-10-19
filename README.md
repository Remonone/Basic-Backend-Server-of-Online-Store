# Express Assignment

Create a REST API with express with the following requirements:

1. create a server in the server.ts file
2. connect to database (SQL or NoSQL)
3. The API has 3 routers: user, product and order
4. Each router should be able to execute CRUD operations. For now, the logic for the CRUD operation can be omitted. For example:

userRouter.get('/all', (req, res) => {})
userRouter.post('/', (req, res) => {})

4.  Use global middleware in your app to allow reading json and form data

5.  Create a custom middleware that will log information of every request. The information could contain current date time, path. The log should be stored inside a file (use fs module for this)

6.  Create error handler middleware
