import {Builder, By, Key, until} from "selenium-webdriver";
import {assert, expect} from "chai";
//webdriver-manager start


describe('ForgottenPassword check page', function () {
    this.timeout(30000);
    let driver;
    const baseUrl = "http://n-code-study.com.ua/#/";

    const email = async (input) => {
        await driver.findElement(By.name("login")).sendKeys(input);
    }

    const emailInput = async () => {
        return await driver.findElement(By.name("login"));
    }

    const restoreBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-forgot-password/section/div/form/button"));
    }

    const takeMistake = async () => {
        return await driver
            .findElement(By.xpath("//*[@id=\"cdk-overlay-0\"]/snack-bar-container/div/div/simple-snack-bar"));
    }

    const backBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-forgot-password/section/div/button"));
    }

    const actionMove = async (input) => {
        let action = await driver.actions({bridge: true});
        await action.move({origin: input}).perform();
    }

    beforeEach(async function () {
        driver = await new Builder()
            .usingServer("http://localhost:4444/wd/hub")
            .forBrowser('chrome')
            .build();
        await driver.manage().setTimeouts({implicit: 20000, pageLoad: 10000});
        await driver.get(baseUrl + "forgot-password");
        await driver.manage().window().maximize();
    })
    afterEach(async function () {
        await driver.quit();
    });
    it("valid data input", async function () {
        await email("tutor@gmail.com");
        let button = await restoreBtn();
        await button.click();
        //check
        await driver.wait(until.urlIs(baseUrl + "?accessDenied=true"));
    });
    it("invalid email input", async function () {
        await email("tutor.gmail.com");
        let button = await restoreBtn();
        await button.click();
        //check
        await expect(await driver.getCurrentUrl()).to.equal(baseUrl + "forgot-password");
    });

    it("not registered user", async function () {
        let emailInput = await emailInput();
        await emailInput.sendKeys("eduardmazur@outlook.com", Key.ENTER);
        await driver.wait(until.alertIsPresent, 5000);
        let mistake = await takeMistake();
        let textMistake = await mistake.getText();
        //check
        await expect(textMistake).to.equal("There is no user with given email.");
    });

    it("Submit button color (not filled)", async function () {
        await email("");
        let button = await restoreBtn();
        await button.click();
        await actionMove(button);
        let value = await button.getAttribute("class");
        let color = await button.getCssValue("background-color");
        //check
        await expect(value).to.equal("pass-form__btn button__disabled");
        await expect(color).to.equal("rgba(128, 128, 128, 1)")
    });

    it("Submit button color (filled)", async function () {
        await email("tutor@gmail.com")
        let button = await restoreBtn();
        await actionMove(button);
        let color = await button.getCssValue("background-color");
        let value = await button.getCssValue("cursor");
        //check
        await expect(value).to.equal("pointer");
        await expect(color).to.equal("rgba(0, 117, 255, 1)")
    });

    it("check pointer & click Back button", async () => {
        let back = await backBtn();
        await actionMove(back)
        let value = await back.getCssValue("cursor");
        //check pointer
        await expect(value).to.equal("pointer");
        await back.click();
        //check
        await driver.wait(until.urlIs(baseUrl), 5000);
    });

    it("refresh forgotPassword page", async () => {
        await driver.navigate().refresh();
        await driver.wait(until.urlIs(baseUrl + "forgot-password"));
    });

    it("check placeholders", async ()=>{
        let input = await emailInput();
        await actionMove(input);
        let placeholder = await input.getAttribute("data-placeholder");
        await expect(placeholder).to.eql("Введите e-mail");
    });

    it("text about invalid input", async () => {
        await email("tutor");
        let text = await driver
            .findElement(By.id("mat-form-field-label-1"))
            .getText();
        await expect(text).to.eql("Введите валидный e-mail");
    });

})