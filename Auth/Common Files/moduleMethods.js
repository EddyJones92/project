import {By} from "selenium-webdriver";
import BasePage from "../../Сommon methods/BasePage.js";

export default class ModuleMethods extends BasePage{
    constructor() {
        super();
    }

    async takePlaceholder(input) {
        let action = await this.driver.actions({bridge: true});
        await action.move({origin: input}).perform();
        return await input.getAttribute("data-placeholder");
    }

    async moveTo(input) {
        let action = await this.driver.actions({bridge: true});
        await action.move({origin: input}).perform();
    }

    async writeEmail(...args) {
        await this.driver.findElement(By.name("email")).sendKeys(...args);
    }

    async writePassword(...args) {
        await this.driver.findElement(By.name("password")).sendKeys(...args);
    }

    async email() {
        return await this.driver.findElement(By.name("email"));
    }

    async password() {
        return await this.driver.findElement(By.name("password"));
    }

    async takeMistake() {
        return await this.driver.findElement(By.id("cdk-overlay-0")).getText();
    }

    async takeMatInput (num){
        return await this.driver
            .findElement(By.id("mat-form-field-label-" + num))
            .getText();
    }

}