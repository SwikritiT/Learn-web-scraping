const { chromium } = require('playwright');
const util = require('util')
const fs = require('fs');
const categoriesXpath = '//div[@class="categoryContainer"]//div[contains(@class,"clearFix")]/a/h4'
const bookNameXpath =
    '//div[@class="categoryContainer"]//div[contains(@class,"clearFix")]/a/h4[contains(text(),"%s")]/parent::a//div/img'
const url = 'https://www.goodreads.com/choiceawards/best-books-2022'

async function scrapeGoodreads(){
    const browser = await chromium.launch({
        headless:true // we don't need to the UI
    })
    const page = await browser.newPage()
    await page.goto(url)
    const categories = await page.locator(categoriesXpath).allInnerTexts()
    let books = {}
  //  const name = await page.getAttribute(bookNameXpath,'alt')
    for (const category of categories) {
        books[category] = await page.getAttribute(util.format(bookNameXpath,category),'alt')
    }
    fs.writeFileSync('./goodreads/BestBooksOf2022.json', JSON.stringify(books));
    await browser.close();
}

// call the above function
scrapeGoodreads()
