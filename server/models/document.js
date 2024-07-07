const mongoose = require('mongoose');

const documentSubSchema = mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    url: {type: String, required: true},
    description: {type: String}
})

const documentSchema = mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true},
    url: {type: String, required: true},
    description: {type: String},
    children: [documentSubSchema]
});

module.exports = mongoose.model("Document", documentSchema);