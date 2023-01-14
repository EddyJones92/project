import assert from "assert";
import {Builder, By, Key, until} from "selenium-webdriver";

describe('N-codeRun', function () {
    this.timeout(30000);
    let driver;
    beforeEach(async function () {
        driver = await new Builder()
            .usingServer("http://localhost:4444/wd/hub")
            .forBrowser('chrome').build();
        await driver.manage().setTimeouts({implicit: 20000, pageLoad: 10000});
    })
    afterEach(async function () {
        // await driver.quit();
    });

    it("Smoke Test book lesson", async function () {
        await driver.get("http://ncode-study-v1.0.0.s3-website.us-east-2.amazonaws.com/");
        await driver.manage().window().maximize();
        // const input = await driver.wait(
        //     until.elementLocated(By.id("mat-input-0")),
        //     20000
        // );
        // input.sendKeys("tutor@gmail.com");
        await driver.findElement(By.id("mat-input-0")).sendKeys("tutor@gmail.com");
        await driver.findElement(By.xpath("//*[@id=\"mat-input-1\"]")).sendKeys("123456", Key.ENTER);

        await driver.wait(until.urlIs("http://ncode-study-v1.0.0.s3-website.us-east-2.amazonaws.com/dashboard/calendar"), 5000);

        const actions = await driver.actions();
        await driver.sleep(1000);
        await actions
            .contextClick(driver.findElement(By.xpath("/html/body/app-root/app-dashboard/div/app-student/div/app-student-calendar/div/div/div[2]/div[37]/div[1]")))
            // .click(driver.findElement(By.xpath("//*[@id=\"mat-menu-panel-2\"]/div/div/button[3]")))
            // .click(driver.findElement(By.xpath("//*[@id=\"mat-dialog-4\"]/app-create-lessons/div/div/div[1]/select[1]/option[11]")))
            // .click(driver.findElement(By.xpath("//*[@id=\"mat-dialog-4\"]/app-create-lessons/div/div/div[1]/select[2]/option[11]")))
            // .click(driver.findElement(By.xpath("//*[@id=\"mat-dialog-4\"]/app-create-lessons/div/div/div[3]/button[2]")))
            .perform();

        await driver.wait(until.elementLocated(By.xpath("//*[@id=\"mat-menu-panel-0\"]/div/div/button[3]")), 5000).click();

        await driver.wait(until.
        elementLocated(By.xpath("//*[@id=\"mat-dialog-0\"]/app-create-lessons/div/div/div[1]/select[1]/option[11]")), 5000)
            .click();
        await driver.wait(until.
        elementLocated(By.xpath("//*[@id=\"mat-dialog-0\"]/app-create-lessons/div/div/div[1]/select[2]/option[11]")), 5000)
            .click();
        await driver.wait(until.
        elementLocated(By.xpath("//*[@id=\"mat-dialog-0\"]/app-create-lessons/div/div/div[3]/button[2]")), 5000)
            .click();
        // await driver.sleep(2000);
        // await actions
        //     .contextClick(driver.findElement(By.xpath("/html/body/app-root/app-dashboard/div/app-student/div/app-student-calendar/div/div/div[2]/div[45]")))
        //     .perform();
        // await driver.wait(until.
        // elementLocated(By.xpath("//*[@id=\"mat-menu-panel-0\"]/div/div/button[4]")), 5000)
        //     .click();
        // await driver.wait(until.
        // elementLocated(By.xpath("//*[@id=\"mat-dialog-1\"]/app-confirm-pop-up/div/div/div/button[2]")), 5000)
        //     .click();


        // let currentUrl = await driver.getCurrentUrl();
        // console.log(currentUrl);
        // await assert.equal(currentUrl, "http://ncode-study-v1.0.0.s3-website.us-east-2.amazonaws.com/dashboard/calendar")

    });

})