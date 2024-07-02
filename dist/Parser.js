import axios from 'axios';
import cheerio from 'cheerio';
export default class AliExpressParser {
    constructor() {
        this.baseURL = 'https://www.aliexpress.com/w/wholesale-';
    }
    async search(query, page = 1) {
        const url = `${this.baseURL}${query}.html`;
        const response = await axios.get(url);
        const html = response.data;
        return this.parseHTML(html);
    }
    parseHTML(html) {
        const $ = cheerio.load(html);
        const items = [];
        $('.list-item').each((index, element) => {
            const item = {};
            item.title = $(element).find('.item-title').text().trim();
            item.price = $(element).find('.price').text().trim();
            item.image = $(element).find('img').attr('src');
            item.link = $(element).find('.item-title a').attr('href');
            items.push(item);
        });
        return items;
    }
}
