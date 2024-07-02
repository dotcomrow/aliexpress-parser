import axios from 'axios';
import cheerio from 'cheerio';

export default class AliExpressParser {
    private baseURL: string;

    constructor() {
        this.baseURL = 'https://www.aliexpress.com/w/wholesale-';
    }

    public async search(query: string, page: number = 1): Promise<any[]> {
        const url = `${this.baseURL}${query}.html`;
        const response = await axios.get(url);
        const html = response.data;
        return this.parseHTML(html);
    }

    private parseHTML(html: string): any[] {
        const $ = cheerio.load(html);
        const items: any[] = [];

        $("script").each((index, element) => {
            const elementHtml = $(element).html();
            if (elementHtml && elementHtml.includes('window._dida_config_._init_data_=')) {
              var jsondata = elementHtml.substring(elementHtml.indexOf('window._dida_config_._init_data_=') + 'window._dida_config_._init_data_='.length, elementHtml.length);
              jsondata = jsondata.slice(0,3) + "\"data\"" + jsondata.slice(7);
              var data = JSON.parse(jsondata);
              var itemsData = data.data.data.root.fields.mods.itemList.content;
              itemsData.forEach((itm: any) => {
                items.push(itm);
              });
            }
        });
        
        return items;
    }
}