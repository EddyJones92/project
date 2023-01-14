import {Builder, Key, By, until} from "selenium-webdriver";

export default class BasePage {
    constructor() {
    }

    async init() {
        this.driver = await new Builder()
            .usingServer("http://localhost:4444/wd/hub")
            .forBrowser('chrome')
            .build();
        return this.driver
    }

    async manageWindow() {
        await this.driver.manage().setTimeouts({implicit: 20000, pageLoad: 10000});
        await this.driver.manage().window().maximize();
    }

    async goTo(url) {
        await this.driver.get(url);
    }


}