const puppeteer = require('puppeteer');
require('dotenv/config')
const Product = require('./models/Product')

const url = 'https://amazon.com/s?k='
const keywords = ['shoes', 'plant', 'tshirt', 'pants', 'hat']


const chooseRandom = (words) => words[Math.floor(Math.random()*words.length)]

const sendDataToDB = async (products) => {
	products.forEach( async (p) => {
		await new Product({
			title: p.title,
			price: p.price,
			numberOfReviews: p.numberOfReviews,
			avgRating: p.avgRating,
			dateFirstListed: p.dateFirstListed
		}).save()
	})
}

const articleUrl = async () => {
	const linkSelector = 'h2 a'
	return await page.$$eval(linkSelector, (links) => links.map(link => link.href));
}

const fetchDate = async (url) => {
	await page.goto(url)
	console.log(url)
}

const scrapper = async () => {

	const titleSelector = 'h2'
	const priceSelector = '.a-price .a-offscreen'
	const numberOfReviewsSelector = '.s-result-item span a.a-link-normal span.a-size-base'
	const avgRatingSelector = '.a-section .a-icon-star-small'

	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	})
	const page = await browser.newPage()

	for (let i = 1; i < 4; i++) {

		let pageURL = url + chooseRandom(keywords) + '&page=' + i
		
		await page.goto(pageURL)


		await Promise.all([
				page.waitForSelector(titleSelector),
				page.waitForSelector(priceSelector),
				page.waitForSelector(numberOfReviewsSelector),
				page.waitForSelector(avgRatingSelector),
			])
		
		const products = await page.evaluate( async (page) => {
	
			const productBlocs = document.querySelectorAll('.s-result-item')
			let data = []

			for(let p of productBlocs){
				const title = p.querySelector('h2')
				let productTitle = title ? title.innerText.trim().replace('\\','') : null

				const price = p.querySelector('.a-price .a-offscreen')
				let productPrice = price ? price.innerText : null

				const numberOfReviews = p.querySelector('.s-result-item span a.a-link-normal span.a-size-base')
				let productNumberOfReviews = numberOfReviews ? numberOfReviews.innerText : null

				const avgRating = p.querySelector('.a-section .a-icon-star-small')
				let productavgRating = avgRating ? avgRating.innerText.substring(0,3) : null

				const link = (p.querySelector('h2 a')) ? p.querySelector('h2 a').href : null

				data.push({
					title: productTitle,
					price: productPrice,
					numberOfReviews: productNumberOfReviews,
					avgRating: productavgRating,
					dateFirstListed: null,
					url: link
				})
			}
			return data
		})

		//fetch the date in each product page.
		for(p of products) {
			if(p.url){
				try {
					await page.goto(p.url)
					const dateSelector = '#descriptionAndDetails'
					await page.waitForSelector(dateSelector)

					const description = await page.$eval(dateSelector, dateSelector => dateSelector.innerText)

					const date = description
					.split("Date first listed on Amazon:")
					.pop()
					.split("\n")
					.shift()
					.trim()
					p.dateFirstListed = date
				} catch(e) {
					console.log(e)
				}
			}
		}

		await sendDataToDB(products)

		console.log(products)

	}

	await browser.close()
	process.exit()
};

module.exports = scrapper