const router = require('koa-router');
const noteModel = require('./models/note');
const userModel = require('./models/users');
const userHandler = require('./handlers/userHandler');
const jwt = require('jsonwebtoken');
const jwtHandler = require('./handlers/jwtHandler');

const secret = process.env.JWT_SECRET || 'secret';

var notesRouter = new router({
    prefix: '/api/v1'
});

notesRouter
    .post('/user', async (ctx, next) => {
        // Accepts a username, password, and other info
        // Creates a new user
        var userData = ctx.request.body;
        
        if(await userHandler.usernameIsUnique(userData.username) && await userHandler.checkPassword(userData.password)) {
            userData.uid = await userHandler.generateUID();
            const user = new userModel(userData);

            try {
                await user.save();
                ctx.response.status = 201;
            } catch (err) {
                ctx.response.status = 400;
                ctx.response.err;
            }
        } else {
            ctx.response.status = 403;
        }
        return next();
    })
    .post('/users/authenticate', async (ctx, next) => {
        // Accepts requests containing username and password in the body
        // If they are correct then a JWT Auth token is returned
        // {
        //    "username": "USERNAME",
        //    "password": "PASSWORD"
        // }
        var userData;
        await userModel.findOne({username: ctx.request.body.username, password: ctx.request.body.password},
        (err, user) => {
            if(err || !user) {
                ctx.response.status = 401;
            } else {
                userData = user;
            }
        }).lean();
        delete userData.firstName;
        delete userData.lastName;
        delete userData.password;
        delete userData._id;
        delete userData.__v;
        console.log(userData);
        await jwtHandler.getToken(ctx, userData, secret);
        return next();
    })
    .get('/', (ctx, next) => {
        ctx.body = 'Notes API';
        return next();
    })
    .get('/notes', async (ctx, next) => {
        // Return all notes for the user
        // Verify and decode JWT token
        // Header: Authentication=token
        const tokenPayload = await jwtHandler.verifyToken(ctx.request.header.authorization, secret);
        const notes = await noteModel.find({ownerUID: tokenPayload.uid});

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
        // Verify and decode JWT token
        // {
        //    "content": "NOTE_BODY_TEXT",
        //    "title": "NOTE_TITLE"
        // }
        var noteData = ctx.request.body;
        const tokenPayload = await jwtHandler.verifyToken(ctx.request.header.authorization, secret);
        if(tokenPayload) {
            noteData.ownerUID = tokenPayload.uid;

            console.log(noteData);
            const note = new noteModel(noteData);
            
            try {
                await note.save();
                ctx.response.body = note;
                ctx.response.status = 201;
            } catch (err) {
                ctx.response.status = 401;
                ctx.response.err;
            }
        } else {
            ctx.response.status = 401;
            ctx.response.err;
        }
        return next();
    })
    .get('/note/:id', async (ctx, next) => {
        // Find note with matching ID and return
        // Return resource not found if no matching ID
        const tokenPayload = await jwtHandler.verifyToken(ctx.request.header.authorization, secret);
        if(tokenPayload) {
            const note = await noteModel.findOne({_id: ctx.params.id, ownerUID: tokenPayload.uid}, (err, note) => {
                if(note && !err) {
                    ctx.response.body = note;
                    ctx.response.status = 200;
                } else {
                    ctx.response.status = 404;
                    ctx.response.err;
                }
            });
        } else {
            ctx.response.status = 403;
            ctx.response.err;
        }
        return next();
    })
    .put('/note/:id', async (ctx, next) => {
        // Find and update note with matching ID
        // Return resource not found if no matching ID
        const tokenPayload = await jwtHandler.verifyToken(ctx.request.header.authorization, secret);
        const update = ctx.request.body;
        if(tokenPayload) {
            const note = await noteModel.findOneAndUpdate({_id: ctx.params.id, ownerUID: tokenPayload.uid}, update, {
                new: true
            });
            if(note) {
                ctx.response.body = note;
            } else {
                ctx.response.status = 400;
                ctx.response.err;
            }
        } else {
            ctx.response.status = 403;
            ctx.response.err;
        }
        return next();
    })
    .del('/note/:id', async (ctx, next) => {
        // Find note with matching ID and delete
        // Return success or failure if no matching ID is found
        const tokenPayload = await jwtHandler.verifyToken(ctx.request.header.authorization, secret);
        if(tokenPayload) {
            const deleted = await noteModel.findOneAndDelete({_id: ctx.params.id, ownerUID: tokenPayload.uid});
            if(deleted) {
                ctx.response.body = deleted;
                ctx.response.status = 200;
            } else {
                ctx.response.status = 400;
                ctx.response.err;
            }
        } else {
            ctx.response.status = 403;
            ctx.response.err;
        }
        return next();
    })

module.exports = notesRouter.routes();