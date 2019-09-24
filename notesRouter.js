const router = require('koa-router');
const noteModel = require('./models/note');
const userModel = require('./models/users');
const userHandler = require('./userHandler');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';

var notesRouter = new router({
    prefix: '/api/v1'
});

notesRouter
    .post('/user', async (ctx, next) => {
        // Accepts a username, password, and other info
        // Creates a new user
        var userData = ctx.request.body;
        if(userHandler.usernameIsUnique && userHandler.checkPassword) {
            userData.uid = userHandler.generateUID;
        }
        const user = new userModel(userData);

        try {
            await user.save();
            ctx.response.status = 201;
        } catch (err) {
            ctx.response.status = 400;
            ctx.response.err;
        }
    })
    .post('/users/authenticate', async (ctx, next) => {
        // Accepts requests containing username and password in the body
        // If they are correct then a JWT Auth token is returned
        const user = await userModel.find({username: ctx.body.username, password: ctx.body.password});
        
        try {
            const payload = {
                username: user.username,
                id: user.uid,
                exp: Date.UTC
            };
            const token = jwt.sign(payload, secret);
            ctx.response.body = token;
        } catch (err) {
            ctx.response.status = 401;
            ctx.response.err;
        }
        
    })
    .get('/', (ctx, next) => {
        ctx.body = 'Notes API';
        return next();
    })
    .get('/notes', async (ctx, next) => {
        // Return all notes
        const notes = await noteModel.find({});

        try {
            ctx.response.body = notes;
            ctx.response.status = 200;
        } catch (err) {
            ctx.response.status = 500;
            ctx.response.err;
        }
        return next();
    })
    .post('/note', async (ctx, next) => {
        // Add new note to database and give it an ID
        const note = new noteModel(ctx.request.body);
        
        try {
            await note.save();
            ctx.response.body = note;
            ctx.response.status = 201;
        } catch (err) {
            ctx.response.status = 500;
            ctx.response.err;
        }
    })
    .get('/note/:id', (ctx, next) => {
        // Find note with matching ID and return
        // Return resource not found if no matching ID
        
    })
    .put('/note/:id', (ctx, next) => {
        // Find and update note with matching ID
        // Return resource not found if no matching ID
        database.updateNote(id, ctx.request.body);
    })
    .del('/note/:id', (ctx, next) => {
        // Find note with matching ID and delete
        // Return success or failure if no matching ID is found
        database.deleteNote(id);
    })

module.exports = notesRouter.routes();