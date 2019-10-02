const mongoose = require('mongoose');

const Schema = mongoose.Schema;
ProductSchema = new Schema({
	title : String,
	price: String,
	numberOfReviews: String,
	avgRating: String,
	dateFirstListed: String
});

module.exports = mongoose.model('Product', ProductSchema);