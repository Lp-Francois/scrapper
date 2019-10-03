# Web crawler 

[![pipeline status](https://gitlab.com/AsterYujano/web-crawler/badges/master/pipeline.svg)](https://gitlab.com/AsterYujano/web-crawler/commits/master)

Nodejs application using Puppeteer to scrap amazon products.

## Getting started

To run this web scrapper, you need to have [Nodejs](https://nodejs.org/en/) and NPM.

1. MongoDB

The scrapper is intented to send the scrapped data to a mongoDB database. Change the `.env.example` file to `.env` and adapt the URL to your needs (username, password, domain name, port, database name).

The url is following this scheme : `mongodb://USERNAME:PASSWORD@DOMAIN_NAME:PORT/DB_NAME`

2. Install dependencies

This command will install required dependencies (puppeteer, etc).

```
npm install
```

3. Run
	
To run the scrapper:
```
npm start
```

## Errors handling

Sometimes, Amazon does not provide what we want, like the "date first listed" for a product ([example here](https://www.amazon.com/Compression-Protective-Basketball-Volleyball-Training-Adult/dp/B07TT31684/ref=sr_1_65?dchild=1&keywords=t-shirt&qid=1570119227&s=gateway&sr=8-65%27)).

By default, it is replaced with `null` in the database.