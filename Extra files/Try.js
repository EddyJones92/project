import {Builder, By, Key, until} from "selenium-webdriver";
import {assert} from "chai";

describe('Registration', function () {
    this.timeout(30000);
    let driver;
    const baseUrl = "http://ncode-study-v1.0.0.s3-website.us-east-2.amazonaws.com/signup"

    const firstName = async (input) => {
        await driver.findElement(By.name("first-name")).sendKeys(input);
    }
    const lastName = async (input) => {
        await driver.findElement(By.name("second-name")).sendKeys(input);
    }

    beforeEach(async function () {
        driver = await new Builder()
            .usingServer("http://localhost:4444/wd/hub")
            .forBrowser('chrome')
            .build();
        await driver.manage().setTimeouts({implicit: 20000, pageLoad: 10000});
        await driver.get(baseUrl);
        await driver.manage().window().maximize();
    })
    afterEach(async function () {
        await driver.quit();
    });

    it('should ', async function () {
        await firstName("ed");
        await lastName("mazur")
    });
})