const mongoose = require('mongoose')
const scrapper = require('./scrapper')

mongoose.connect(
	process.env.DB_CONNECTION, 
	{
		useNewUrlParser : true,
		useUnifiedTopology: true
	}
);

scrapper()