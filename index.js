const koa = require('koa');
const protect = require('koa-protect');
const bodyParser = require('koa-body');
const notesRouter = require('./notesRouter');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = new koa();
app.use(bodyParser());

app.use(protect.koa.sqlInjection({
    body: true,
    loggerFunction: console.error
}));

app.use(protect.koa.xss({
    body: true,
    loggerFunction: console.error
}));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.use(notesRouter);

app.listen(3000);

console.log('Notes API Started. Listening on 3000');

