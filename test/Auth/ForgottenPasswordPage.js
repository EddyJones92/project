import {Builder, By, Key, until} from "selenium-webdriver";
import {assert, expect} from "chai";
import ModuleMethods from "../../tests_lib/Common Files/moduleMethods.js";
import ModuleVariables from "../../tests_lib/Common Files/moduleVariables.js";
import {describe} from "mocha/lib/cli/run.js";
//webdriver-manager start

describe('ForgottenPassword check page', function () {
    this.timeout(30000);
    let driver;
    const browser = new ModuleMethods();
    const auth = new ModuleVariables();

    const email = async (input) => {
        await driver.findElement(By.name("login")).sendKeys(input);
    }

    const emailInput = async () => {
        return await driver.findElement(By.name("login"));
    }

    const restoreBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-forgot-password/section/div/form/button"));
    }

    const backBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-forgot-password/section/div/button"));
    }

    beforeEach(async function () {
        driver = await browser.init();
        await browser.goTo(auth.baseUrl + "forgot-password");
        await browser.manageWindow();
    })
    afterEach(async function () {
        await driver.quit();
    });

    it("valid data input", async function () {
        await email(auth.tutor.email);
        let button = await restoreBtn();
        await button.click();
        //check
        await driver.wait(until.urlIs(baseUrl));
    });

    it("invalid email input", async function () {
        await email("tutor.gmail.com");
        let button = await restoreBtn();
        await button.click();
        //check
        await expect(await driver.getCurrentUrl()).to.equal(baseUrl + "forgot-password");
    });

    it("not registered user", async function () {
        let emailEnter = await emailInput();
        await emailEnter.sendKeys("eduardmazur@outlook.com", Key.ENTER);
        await driver.wait(until.alertIsPresent, 5000);
        let textMistake = await browser.takeMistake();
        //check
        await expect(textMistake).to.equal("There is no user with given email.");
    });

    it("Submit button color (not filled)", async function () {
        await email("");
        let button = await restoreBtn();
        await button.click();
        await browser.moveTo(button);
        let value = await button.getAttribute("class");
        let color = await button.getCssValue("background-color");
        //check
        await expect(value).to.equal("pass-form__btn button__disabled");
        await expect(color).to.equal("rgba(128, 128, 128, 1)")
    });

    it("Submit button color (filled)", async function () {
        await email("tutor@gmail.com")
        let button = await restoreBtn();
        await browser.moveTo(button);
        let color = await button.getCssValue("background-color");
        let value = await button.getCssValue("cursor");
        //check
        await expect(value).to.equal("pointer");
        await expect(color).to.equal("rgba(0, 117, 255, 1)")
    });

    it("check pointer & click Back button", async () => {
        let back = await backBtn();
        await browser.moveTo(back)
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
        let placeholder =  await browser.takePlaceholder(input);
        await expect(placeholder).to.eql("Введите e-mail");
    });

    it("text about invalid input", async () => {
        await email("tutor");
        let text = await browser.takeMatInput(1);
        await expect(text).to.eql("Введите валидный e-mail");
    });

})