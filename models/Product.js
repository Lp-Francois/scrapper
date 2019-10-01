const mongoose = require('mongoose');

const Schema = mongoose.Schema;
ProductSchema = new Schema({
	title : String
});

module.exports = mongoose.model('Product', ProductSchema);