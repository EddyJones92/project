import {Builder, By, Key, until} from "selenium-webdriver";
import {assert, expect} from "chai";
import BasePage from "../tests_lib/Сommon methods/BasePage.js";
//webdriver-manager start

describe("Registration", function () {
    this.timeout(30000);
    let driver;
    let browser;
    const baseUrl = "http://n-code-study.com.ua/#/"

    const firstName = async () => {
        return await driver.findElement(By.name("first-name"));
    }
    const firstNameInput = async (input) => {
        await driver.findElement(By.name("first-name")).sendKeys(input);
    }
    const lastName = async () => {
        return await driver.findElement(By.name("second-name"));
    }
    const lastNameInput = async (input) => {
        await driver.findElement(By.name("second-name")).sendKeys(input);
    }
    const confirmPassword = async () => {
        return await driver.findElement(By.name("confirm-passord"));
    }
    const confirmPasswordInput = async (input) => {
        await driver.findElement(By.name("confirm-passord")).sendKeys(input);
    }
    const role = async () => {
        await driver.findElement(By.xpath("//*[@id=\"mat-select-0\"]")).click();
        await driver.findElement(By.id("mat-option-1")).click();
    }
    const createUserBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-register/section/div/form/button[2]"))
    }
    const showPassword = async (num) => {
        await driver.findElement(By.xpath("/html/body/app-root/app-register/section/div/form/mat-form-field[" + num + "]/div/div[1]/div/i"))
            .click();
    }

    beforeEach(async function () {
        browser = new BasePage();
        driver = await browser.init();
        await browser.goTo(baseUrl + "signup");
        await browser.manageWindow();
    })
    afterEach(async function () {
        await driver.quit();
    })
    it("Valid data check", async function () {
        await firstNameInput("ed");
        await lastNameInput("mazur");
        await browser.writeEmail("eduardmazur@outlook.com");
        await browser.writePassword("111111Qq");
        await confirmPasswordInput("111111Qq");
        await role();
        let button = await createUserBtn();
        await browser.moveTo(button);
        let color = await button.getCssValue("background-color");
        let value = await button.getCssValue("cursor");
        //check
        await expect(value).to.equal("pointer");
        await expect(color).to.equal("rgba(0, 117, 255, 1)")
    });

    it("Firstname field check", async () => {
        let field = await firstName();
        let placeholder = await browser.takePlaceholder(field);
        await field.sendKeys("", Key.TAB);
        await browser.moveTo(field);
        let textEmptyField = await browser.takeMatInput(1);
        await field.sendKeys("1234");
        let textNumbers = await browser.takeMatInput(1);
        await field.clear();
        await field.sendKeys("!?");
        let textSymbols = await browser.takeMatInput(1);
        //check
        await expect(placeholder).to.eql("Имя");
        await expect(textEmptyField).to.eql("Введите имя");
        await expect(textNumbers).to.eql("Поле имя не может местить символы или цифры");
        await expect(textSymbols).to.eql("Поле имя не может местить символы или цифры");
    });

    it("Lastname field check", async () => {
        let field = await lastName();
        let placeholder = await browser.takePlaceholder(field);
        await field.sendKeys("", Key.TAB);
        await browser.moveTo(field);
        let textEmptyField = await browser.takeMatInput(3);
        await field.sendKeys("1234");
        let textNumbers = await browser.takeMatInput(3);
        await field.clear();
        await field.sendKeys("!?");
        let textSymbols = await browser.takeMatInput(3);
        //check
        await expect(placeholder).to.eql("Фамилия");
        await expect(textEmptyField).to.eql("Введите фамилию");
        await expect(textNumbers).to.eql("Поле фамилия не может местить символы или цифры");
        await expect(textSymbols).to.eql("Поле фамилия не может местить символы или цифры");
    });

    it("Email field check", async () => {
        let field = await browser.email();
        let placeholder = await browser.takePlaceholder(field);
        await field.sendKeys("", Key.TAB);
        await browser.moveTo(field);
        let textEmptyField = await browser.takeMatInput(5);
        await field.sendKeys("tutor.gmail.com");
        let textOnly = await browser.takeMatInput(5);
        await field.clear();
        await field.sendKeys("tutor@");
        let textWithoutDomain = await browser.takeMatInput(5);
        //check
        await expect(placeholder).to.eql("e-mail");
        await expect(textEmptyField).to.eql("Введите e-mail");
        await expect(textOnly).to.eql("Введите валидный e-mail");
        await expect(textWithoutDomain).to.eql("Введите валидный e-mail");
    });

    it("Password field check", async () => {
        let field = await browser.password();
        let placeholder = await browser.takePlaceholder(field);
        await field.sendKeys("", Key.TAB);
        await browser.moveTo(field);
        let textEmptyField = await browser.takeMatInput(7);
        await field.sendKeys("1234567");
        let shortPassword = await browser.takeMatInput(7);
        await field.clear();
        await field.sendKeys("12345678912345678");
        let longPassword = await browser.takeMatInput(7);
        await field.clear();
        await field.sendKeys("123456789");
        let onlyNumbers = await browser.takeMatInput(7);
        await field.clear();
        await field.sendKeys("123456789q");
        let onlyLoverCase = await browser.takeMatInput(7);
        await field.clear();
        await field.sendKeys("123456789Q");
        let onlyUpperCase = await browser.takeMatInput(7);
        await field.clear();
        await field.sendKeys("123456789й");
        let onlyLatin = await browser.takeMatInput(7);
        await showPassword(4);
        let typeText = await field.getAttribute("type");
        await showPassword(4);
        let typePassword = await field.getAttribute("type");

        //check
        await assert.equal(typeText, "text", "typeText is a text");
        await assert.equal(typePassword, "password", "typeText is a password");
        await expect(placeholder).to.eql("Пароль (8-16 символов)");
        await expect(textEmptyField).to.eql("Введите пароль");
        await expect(shortPassword).to.eql("Пароль не может быть короче 8 символов");
        await expect(longPassword).to.eql("Пароль слишком длинный");
        await expect(onlyNumbers).to.eql("Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры");
        await expect(onlyLoverCase).to.eql("Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры");
        await expect(onlyUpperCase).to.eql("Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры");
        await expect(onlyLatin).to.eql("Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры");
    });


});