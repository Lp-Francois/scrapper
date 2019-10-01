const puppeteer = require('puppeteer');
const mongoose = require('mongoose')
require('dotenv/config')
const Product = require('./models/Product')

const url = 'https://amazon.com/s?k='
const keywords = ['garden', 'star-wars', 'tshirt', 'pants', 'drink']

mongoose.connect(
	process.env.DB_CONNECTION, 
	{
		useNewUrlParser : true,
		useUnifiedTopology: true
	}
);

const chooseRandom = (words) => words[Math.floor(Math.random()*words.length)]

const sendDataToDB = async (products) => {
	/*
	for(let p of products){
		const product = new Product({
			title: p.title.replace('\\',"")
		})
		const savedProduct = await product.save()
	}
	*/

	products.forEach( async (p) => {
		await new Product({
			title: p.title.replace('\\',"")
		}).save()
	})
}

const scrapper = async () => {

	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	for (let i = 1; i < 4; i++) {

		let pageURL = url + chooseRandom(keywords) + '&page=' + i
		
		await page.goto(pageURL)
		
		const products = await page.evaluate(() => {
	
			const productBlocs = document.querySelectorAll('.s-result-item')
			let data = []
			
			for(let p of productBlocs){
				data.push({
					title: p.querySelector('h2').innerText.trim()
				})
			}
			return data
		})

		await sendDataToDB(products)

		console.log(products)

	}

	await browser.close()
	process.exit()
};

scrapper()
