const puppeteer = require('puppeteer');
const mongoose = require('mongoose')
require('dotenv/config')
const Product = require('./models/Product')

mongoose.connect(
	process.env.DB_CONNECTION, 
	{
		useNewUrlParser : true,
		useUnifiedTopology: true
	}
);


const keywords = ['garden', 'star-wars', 'tshirt', 'pants', 'drink']
let keyword = keywords[Math.floor(Math.random()*keywords.length)];

let url = 'https://amazon.com/s?k='+keyword+'&page=';

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	//for (let i = 1; i >= 3; i++) {}
	let i =1
	
	try {
		let pageURL = url+i
		await page.goto(pageURL);
		console.log(`${pageURL} opened`);
	}catch(err){
		console.log(err);
	}

	const products = await page.evaluate(() => {
		const grabInfo = (bloc, selector) => bloc
			.querySelector(selector)
			.innerText
			.trim()

		const data = []

		const productBlocs = document.querySelectorAll('.s-result-item')

		for(let p of productBlocs){
			data.push({
				title: grabInfo(p, 'h2')
			})
		}

		return data
	})

	
	console.log(products)

	/*
	for(let p of products){
		const product = new Product({
			title: p.title
		})
		try {
			const savedProduct = await product.save();
		}catch(err){
			console.log(err);
		}
	}
	console.log("added to DB")
	*/

	await browser.close()
})();

