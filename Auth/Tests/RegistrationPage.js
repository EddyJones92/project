import {Builder, By, Key, until} from "selenium-webdriver";
import {assert, expect} from "chai";
import BasePage from "../../Сommon methods/BasePage.js";
import ModuleMethods from "../Common Files/moduleMethods.js";
import ModuleVariables from "../Common Files/moduleVariables.js";
//webdriver-manager start

describe("Registration", function () {
    this.timeout(30000);
    let driver;
    const browser = new ModuleMethods();
    const auth = new ModuleVariables();

    const firstName = async () => {
        return await driver.findElement(By.name("first-name"));
    }
    const firstNameInput = async (...args) => {
        await driver.findElement(By.name("first-name")).sendKeys(...args);
    }
    const lastName = async () => {
        return await driver.findElement(By.name("second-name"));
    }
    const lastNameInput = async (...args) => {
        await driver.findElement(By.name("second-name")).sendKeys(...args);
    }
    const confirmPassword = async () => {
        return await driver.findElement(By.name("confirm-passord"));
    }
    const confirmPasswordInput = async (...args) => {
        await driver.findElement(By.name("confirm-passord")).sendKeys(...args);
    }
    const role = async (num) => {
        await driver.findElement(By.id("mat-select-0")).click();
        await driver.findElement(By.id("mat-option-" + num)).click();
    }
    const roleSelected = async (num) => {
        await driver.findElement(By.id("mat-select-0")).click();
        await driver.findElement(By.id("mat-option-" + num)).click();
        return await driver.findElement(By.id("mat-select-value-1")).getText();
    }
    const createUserBtn = async () => {
        return await driver.findElement(By.xpath("/html/body/app-root/app-register/section/div/form/button[2]"))
    }
    const showPassword = async (num) => {
        await driver.findElement(By.xpath("/html/body/app-root/app-register/section/div/form/mat-form-field[" + num + "]/div/div[1]/div/i"))
            .click();
    }

    beforeEach(async function () {
        driver = await browser.init();
        await browser.goTo( auth.baseUrl + "signup");
        await browser.manageWindow();
    })
    afterEach(async function () {
        await driver.quit();
    })
    it("Valid data check", async function () {
        await firstNameInput(auth.user.name);
        await lastNameInput(auth.user.lastName);
        await browser.writeEmail(auth.user.email);
        await browser.writePassword(auth.user.password);
        await confirmPasswordInput(auth.user.password);
        await role(1);
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
        await showPassword(4);
        let typeText = await field.getAttribute("type");
        await showPassword(4);
        let typePassword = await field.getAttribute("type");
        await field.sendKeys("", Key.TAB);
        await browser.moveTo(field);
        let textEmptyField = await browser.takeMatInput(7);

        await assert.equal(typeText, "text", "typeText is a text");
        await assert.equal(typePassword, "password", "typeText is a password");
        await expect(placeholder).to.eql("Пароль (8-16 символов)");
        await expect(textEmptyField).to.eql("Введите пароль");

        let inputs = ["1234567", "12345678912345678", "123456789", "123456789q", "123456789Q", "123456789й"];
        let expects = [
            "Пароль не может быть короче 8 символов",
            "Пароль слишком длинный",
            "Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры",
            "Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры",
            "Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры",
            "Пароль должен местить буквы латиницы верхнего и нижнего регистра и цифры"
        ];
        for (let i = 0; i < inputs.length; i++) {
            await field.sendKeys(inputs[i]);
            let text = await browser.takeMatInput(7);
            await expect(text).to.eql(expects[i]);
            await field.clear();
        }
    });

    it("Confirm Password field check", async () => {
        let field = await confirmPassword();
        let placeholder = await browser.takePlaceholder(field);
        await field.sendKeys("1234567");
        await browser.writePassword("123456")
        let notMatched = await browser.takeMatInput(9);
        await field.clear();
        await field.sendKeys("");
        let emptyField = await browser.takeMatInput(9);
        await showPassword(5);
        let typeText = await field.getAttribute("type");
        await showPassword(5);
        let typePassword = await field.getAttribute("type");

        //check
        await assert.equal(typeText, "text", "typeText is a text");
        await assert.equal(typePassword, "password", "typeText is a text");
        await expect(placeholder).to.eql("Подтверждение пароля");
        await expect(notMatched).to.eql("Пароли не совпадают");
        await expect(emptyField).to.eql("Пароли не совпадают");
    });
    it("Role select check", () => {
        const roles = ["Студент", "Преподаватель", "Администратор"];

        roles.forEach(async (role, i) => {
            const takenRole = await roleSelected(i);
            await expect(role).to.eql(takenRole);
        });
        // for (let i = 0; i < roles.length; i++) {
        //     let takenRole = await roleSelected(i);
        //     await expect(roles[i]).to.eql(takenRole);
        // }
    });


    // it("Full registration and self-deletion", async function () {
    //     await firstName("ed");
    //     await lastName("mazur");
    //     await email("eduardmazur@i.ua");
    //     await password("111111Qq");
    //     await confirmPassword("111111Qq");
    //     await role();
    //     let button = await createUserBtn();
    //     await button.click();
    //     await driver.get("https://mbox2.i.ua/?_rand=0.31522145372747845");
    //     await driver.wait(until.elementLocated(By.name("login")), 10000);
    //     await driver.findElement(By.name("login")).sendKeys("eduardmazur");
    //     await driver.findElement(By.name("pass")).sendKeys("161192Ed", Key.ENTER);
    //     await driver.wait(until.elementLocated(By.xpath("//*[@id=\"mesgList\"]/form/div[1]")), 10000);
    //     await driver.findElement(By.xpath("//*[@id=\"mesgList\"]/form/div[1]")).click();
    //     let link = await driver.wait(until.elementLocated(By.xpath("/html/body/a")), 10000);
    //     link.click();
    //
    // });

});