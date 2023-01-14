import {Builder, By, Key, until} from "selenium-webdriver";
import {assert, expect} from "chai";
//webdriver-manager start

describe('Auth page check', function () {
    this.timeout(30000);
    let driver;
    const baseUrl = "http://n-code-study.com.ua/#/";

    const inputEmail = async (input) => {
        return await driver.findElement(By.id("mat-input-0")).sendKeys(input);
    }
    const email = async () => {
        return await driver.findElement(By.id("mat-input-0"));
    }
    const inputPassword = async (input) => {
        return await driver.findElement(By.id("mat-input-1")).sendKeys(input, Key.ENTER);
    }
    const password = async () => {
        return await driver.findElement(By.id("mat-input-1"));
    }
    const urlIfAuthorized = async () => {
        return await driver.wait(until.urlIs("http://n-code-study.com.ua/#/dashboard/calendar"), 2000);
    }
    const forgotPasswordBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-login/section/div/div/form/a"));
    }
    const forgotPasswordPage = async () => {
        await driver.wait(until.urlIs("http://n-code-study.com.ua/#/forgot-password"), 2000);
    }
    const getErrorText = async () => {
        return await driver
            .findElement(By.xpath("//*[@id=\"cdk-overlay-0\"]/snack-bar-container/div/div/simple-snack-bar"))
            .getText();
    }
    const submitBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-login/section/div/div/form/button"));
    }
    const registrationBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-login/section/button"));
    }
    const takePlaceholder = async (input) => {
        let action = await driver.actions({bridge: true});
        await action.move({origin: input}).perform();
        return await input.getAttribute("data-placeholder");
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
        await driver.get(baseUrl);
        await driver.manage().window().maximize();
    })
    afterEach(async function () {
        await driver.quit();
    });

    it("Auth tutor", async function () {
        await inputEmail("tutor@gmail.com");
        await inputPassword("123456");
        await urlIfAuthorized();
    });

    it("Auth admin", async function () {
        await inputEmail("admin@gmail.com");
        await inputPassword("123456");
        await urlIfAuthorized();
    });

    it("Auth student", async function () {
        await inputEmail("student@gmail.com");
        await inputPassword("123456");
        await urlIfAuthorized();
    });

    it("Forgot password", async function () {
        let button = await forgotPasswordBtn();
        button.click();
        await forgotPasswordPage();
    })

    it("Eye password field", async () => {
        await driver.findElement(By.xpath("/html/body/app-root/app-login/section/div/div/form/mat-form-field[2]/div/div[1]/div/i"))
            .click();
        let passField = await password();
        let type = await passField.getAttribute("type");
        await assert.equal(type, "text", "type is a text");
    })

    it("input warning (fill fields)", async () => {
        let button = await submitBtn();
        await button.click();
        await driver.wait(until.alertIsPresent);
        let errorText = await getErrorText();
        let checkPassword = await driver.findElement(By.xpath("//*[@id=\"mat-form-field-label-3\"]/mat-label")).getText();
        let checkEmail = await driver.findElement(By.xpath("//*[@id=\"mat-form-field-label-1\"]/mat-label")).getText();
        let expected = await driver.getCurrentUrl();

        await assert.equal(checkEmail, "Введите e-mail");
        await assert.equal(checkPassword, "Введите пароль");
        await assert.equal(errorText, "Fill all required fields");
        await assert.equal(expected, baseUrl);
    })

    it("input warning (incorrect password)", async () => {
        await inputEmail("tutor@gmail.com")
        await inputPassword("111111")
        await driver.wait(until.alertIsPresent);
        let errorText = await getErrorText();
        await assert.equal(errorText, "Incorrect password.");
        let expected = await driver.getCurrentUrl();
        await assert.equal(expected, baseUrl);
    })

    it("input warning (User not exist)", async () => {
        await inputEmail("tutor123@gmail.com")
        await inputPassword("111111")
        await driver.wait(until.alertIsPresent);
        let errorText = await getErrorText();
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
        await actionMove(button);
        let value = await button.getCssValue("cursor");
        await expect(value).to.equal("pointer")
        let text = await button.getCssValue("background-color");
        await expect(text).to.contain("rgba(0, 117, 255");
    });

    it("pointer Enter btn", async function () {
        let button = await submitBtn();
        await actionMove(button);
        let value = await button.getCssValue("cursor");
        await expect(value).to.equal("pointer")
    });

    it("pointer ForgottenPassword btn", async function () {
        let button = await forgotPasswordBtn();
        await actionMove(button)
        let value = await button.getCssValue("cursor");
        await expect(value).to.equal("pointer")
    });

    it("refresh Auth page", async () => {
        await driver.navigate().refresh();
        await driver.wait(until.urlIs(baseUrl));
    });

    it("check placeholders", async () => {
        let emailInput = await email();
        let placeholderEmail = await takePlaceholder(emailInput);
        await expect(placeholderEmail).to.eql("e-mail");
        let passwordInput = await password();
        let placeholderPassword = await takePlaceholder(passwordInput);
        await expect(placeholderPassword).to.eql("password");
    });

    it("text about invalid input", async () => {
        await inputEmail("tutor");
        let text = await driver
            .findElement(By.id("mat-form-field-label-1"))
            .getText();
        await expect(text).to.eql("Введите валидный e-mail");
    });
})