import * as puppeteer from 'puppeteer';
import { exportStocks } from './utils';
import { StockInfo } from './stock-info.interface';

export default class Crawler {
  private browser: puppeteer.Browser;
  private page: puppeteer.Page;
  private HST_URL =
    'https://goodinfo.tw/StockInfo/StockList.asp?MARKET_CAT=%E6%99%BA%E6%85%A7%E9%81%B8%E8%82%A1&INDUSTRY_CAT=%E8%82%A1%E5%83%B9%E5%89%B5%E6%AD%B7%E5%8F%B2%E9%AB%98%E9%BB%9E%40%40%E8%82%A1%E5%83%B9%E5%89%B5%E5%A4%9A%E6%97%A5%E9%AB%98%E9%BB%9E%40%40%E6%AD%B7%E5%8F%B2';
  private TOP_URL =
    'https://goodinfo.tw/StockInfo/StockList.asp?MARKET_CAT=%E7%86%B1%E9%96%80%E6%8E%92%E8%A1%8C&INDUSTRY_CAT=%E6%88%90%E4%BA%A4%E9%87%91%E9%A1%8D+%28%E9%AB%98%E2%86%92%E4%BD%8E%29%40%40%E6%88%90%E4%BA%A4%E9%87%91%E9%A1%8D%40%40%E7%94%B1%E9%AB%98%E2%86%92%E4%BD%8E';

  private async init(): Promise<void> {
    this.browser = await puppeteer.launch(); // { headless: false }
  }

  private async open(url: string): Promise<void> {
    this.page = await this.browser.newPage();
    await this.page.goto(url);
  }

  private async destory(): Promise<void> {
    await this.browser.close();
  }

  private async sortBy(type: string): Promise<void> {
    const button = await this.page.evaluateHandle((type) => {
      const buttons = <HTMLAnchorElement[]>[
        ...document.querySelectorAll(
          '#tblStockList > thead:first-child tr td a.link_black',
        ),
      ];
      const button = buttons.find((button) =>
        button.textContent.includes(type),
      );
      return button;
    }, type);
    if (button) {
      await button.asElement().click();
    }
  }

  public async getHSTStocks(): Promise<StockInfo[]> {
    await this.init();
    await this.open(this.HST_URL);
    await this.sortBy('漲跌幅');
    const arrayOfStocks = <string[][]>(
      await this.page.evaluate(`(${exportStocks.toString()})()`)
    );
    await this.destory();
    const stocks: StockInfo[] = arrayOfStocks.map((stock: string[]) => ({
      number: stock[0],
      name: stock[1],
      date: new Date(`${new Date().getFullYear()}/${stock[2]}`),
      closingPrice: parseFloat(stock[3]),
      highest: parseFloat(stock[4]),
      lowest: parseFloat(stock[5]),
      priceSpread: parseFloat(stock[6]),
      priceChangeRatio: parseFloat(stock[7]),
    }));
    return stocks;
  }

  public async getTOPStocks(): Promise<StockInfo[]> {
    await this.init();
    await this.open(this.TOP_URL);
    await this.sortBy('漲跌幅');
    const arrayOfStocks = <string[][]>(
      await this.page.evaluate(`(${exportStocks.toString()})()`)
    );
    await this.destory();
    const stocks = arrayOfStocks
      .filter((stock) => parseFloat(stock[8]) >= 7.5)
      .map((stock: string[]) => ({
        rank: parseInt(stock[0]),
        number: stock[1],
        name: stock[2],
        date: new Date(`${new Date().getFullYear()}/${stock[4]}`),
        closingPrice: parseFloat(stock[6]),
        priceSpread: parseFloat(stock[7]),
        priceChangeRatio: parseFloat(stock[8]),
        totalVolume: parseInt(stock[9].replace(/,/g, '')),
        totalCost: parseInt(stock[10].replace(/,/g, '')),
        openingPrice: parseFloat(stock[12]),
        highest: parseFloat(stock[13]),
        lowest: parseFloat(stock[14]),
      }));
    return stocks;
  }
}
