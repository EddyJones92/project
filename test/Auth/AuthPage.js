import {Builder, By, Key, until} from "selenium-webdriver";
import {assert, expect} from "chai";
import ModuleMethods from "../../tests_lib/Common Files/moduleMethods.js";
import ModuleVariables from "../../tests_lib/Common Files/moduleVariables.js";
//webdriver-manager start

describe('Auth page check', function () {
    this.timeout(30000);
    let driver;
    const browser = new ModuleMethods();
    const auth = new ModuleVariables();

    const urlIfAuthorized = async () => {
        return await driver.wait(until.urlIs(baseUrl + "dashboard/calendar"), 2000);
    }
    const forgotPasswordBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-login/section/div/div/form/a"));
    }
    const forgotPasswordPage = async () => {
        await driver.wait(until.urlIs(baseUrl + "forgot-password"), 2000);
    }
    const submitBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-login/section/div/div/form/button"));
    }
    const registrationBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-login/section/button"));
    }
    const showPassword = async () => {
        await driver.findElement(By.xpath("/html/body/app-root/app-login/section/div/div/form/mat-form-field[2]/div/div[1]/div/i"))
            .click();
    }

    beforeEach(async function () {
        driver = await browser.init();
        await browser.goTo(auth.baseUrl);
        await browser.manageWindow();
    })
    afterEach(async function () {
        await driver.quit();
    });

    it("Auth tutor", async function () {
        await browser.writeEmail(auth.tutor.email);
        await browser.writePassword(auth.tutor.password, Key.ENTER);
        await urlIfAuthorized();
    });

    it("Auth admin", async function () {
        await browser.writeEmail(auth.admin.email);
        await browser.writePassword(auth.admin.password, Key.ENTER);
        await urlIfAuthorized();
    });

    it("Auth student", async function () {
        await browser.writeEmail(auth.student.email);
        await browser.writePassword(auth.student.password, Key.ENTER);
        await urlIfAuthorized();
    });

    it("Forgot password", async function () {
        let button = await forgotPasswordBtn();
        button.click();
        await forgotPasswordPage();
    })

    it("Eye password field", async () => {
        await showPassword();
        let passField = await browser.password();
        let type = await passField.getAttribute("type");
        await assert.equal(type, "text", "type is a text");
    })

    it("input warning (fill fields)", async () => {
        let button = await submitBtn();
        await button.click();
        await driver.wait(until.alertIsPresent);
        let errorText = await browser.takeMistake();
        let checkPassword = await browser.takeMatInput(3);
        let checkEmail = await  browser.takeMatInput(1);
        let expected = await driver.getCurrentUrl();

        await assert.equal(checkEmail, "Введите e-mail");
        await assert.equal(checkPassword, "Введите пароль");
        await assert.equal(errorText, "Fill all required fields");
        await assert.equal(expected, baseUrl);
    })

    it("input warning (incorrect password)", async () => {
        await browser.writeEmail(auth.tutor.email);
        await browser.writePassword("111111", Key.ENTER);
        await driver.wait(until.alertIsPresent);
        let errorText = await browser.takeMistake();
        await assert.equal(errorText, "Incorrect password.");
        let expected = await driver.getCurrentUrl();
        await assert.equal(expected, baseUrl);
    })

    it("input warning (User not exist)", async () => {
        await browser.writeEmail("123" + auth.tutor.email);
        await browser.writePassword("111111", Key.ENTER);
        await driver.wait(until.alertIsPresent);
        let errorText = await browser.takeMistake();
        await assert.equal(errorText, "User with given email does not exist.");
        let expected = await driver.getCurrentUrl();
        await assert.equal(expected, baseUrl);
    })

    it("registration button", async () => {
        let button = await registrationBtn();
        await button.click();
        await driver.wait(until.urlIs(baseUrl + "signup"), 2000);
    })

    it("hover and pointer Registration btn", async function () {
        let button = await registrationBtn();
        await browser.moveTo(button);
        let value = await button.getCssValue("cursor");
        await expect(value).to.equal("pointer")
        let text = await button.getCssValue("background-color");
        await expect(text).to.contain("rgba(0, 117, 255");
    });

    it("pointer Enter btn", async function () {
        let button = await submitBtn();
        await browser.moveTo(button);
        let value = await button.getCssValue("cursor");
        await expect(value).to.equal("pointer")
    });

    it("pointer ForgottenPassword btn", async function () {
        let button = await forgotPasswordBtn();
        await browser.moveTo(button);
        let value = await button.getCssValue("cursor");
        await expect(value).to.equal("pointer")
    });

    it("refresh Auth page", async () => {
        await driver.navigate().refresh();
        await driver.wait(until.urlIs(baseUrl));
    });

    it("check placeholders", async () => {
        let emailInput = await browser.email();
        let placeholderEmail = await browser.takePlaceholder(emailInput);
        await expect(placeholderEmail).to.eql("e-mail");
        let passwordInput = await browser.password();
        let placeholderPassword = await browser.takePlaceholder(passwordInput);
        await expect(placeholderPassword).to.eql("password");
    });

    it("text about invalid input", async () => {
        await browser.writeEmail("tutor");
        let text = await browser.takeMatInput(1);
        await expect(text).to.eql("Введите валидный e-mail");
    });
})