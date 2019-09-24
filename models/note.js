const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    ownerUID: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: String,
    date: {
        type: Date, 
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;