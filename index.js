const puppeteer = require('puppeteer');
const mongoose = require('mongoose')
require('dotenv/config')
const Product = require('./models/Product')

const url = 'https://amazon.com/s?k='
const keywords = ['garden', 'star-wars', 'tshirt', 'pants', 'drink']
/*
mongoose.connect(
	process.env.DB_CONNECTION, 
	{
		useNewUrlParser : true,
		useUnifiedTopology: true
	}
);
*/

const chooseRandom = (words) => words[Math.floor(Math.random()*words.length)]

const sendDataToDB = async (products) => {
	products.forEach( async (p) => {
		await new Product({
			title: p.title.replace('\\',"")
		}).save()
	})
}

const scrapper = async () => {

	const titleSelector = 'h2'
	const priceSelector = '.a-price .a-offscreen'
	const numberOfReviewsSelector = '.s-result-item span a.a-link-normal span.a-size-base'
	const avgRatingSelector = '.a-section .a-icon-star-small'
	const dateFirstListedSelector = ''

	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	for (let i = 1; i < 4; i++) {

		let pageURL = url + chooseRandom(keywords) + '&page=' + i
		
		await page.goto(pageURL)


		await Promise.all([
				page.waitForSelector(titleSelector),
				page.waitForSelector(priceSelector),
				page.waitForSelector(numberOfReviewsSelector),
				page.waitForSelector(avgRatingSelector),
				//page.waitForSelector(dateFirstListedSelector)
			])
		
		const products = await page.evaluate(() => {
	
			const productBlocs = document.querySelectorAll('.s-result-item')
			let data = []

			for(let p of productBlocs){
				const price = p.querySelector('.a-price .a-offscreen')
				let productPrice = price ? price.innerText : null

				const numberOfReviews = p.querySelector('.s-result-item span a.a-link-normal span.a-size-base')
				let productNumberOfReviews = numberOfReviews ? numberOfReviews.innerText : null

				const avgRating = p.querySelector('.a-section .a-icon-star-small')
				let productavgRating = avgRating ? avgRating.innerText.substring(0,3) : null

				data.push({
					title: p.querySelector('h2').innerText.trim(),
					price: productPrice,
					numberOfReviews: productNumberOfReviews,
					avgRating: productavgRating,
					dateFirstListed: null
				})
			}
			return data
		})

		//await sendDataToDB(products)

		console.log(products)

	}

	await browser.close()
	process.exit()
};

scrapper()
