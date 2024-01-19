import {$el} from "../../../../../scripts/ui.js";
import {VariablesManager} from "./variableManager.js";

export class VariablesTab {
    content;
    normalVariables;
    advancedVariables;

    constructor() {
        const self = this;
        self.normalVariables = new VariablesManager("Variables:");
        self.advancedVariables = new VariablesManager("Advanced:");
        self.content = $el(
            "div.laizypainter-tab-hidden",
            {},
            [
                self.normalVariables.content,
                self.advancedVariables.content
            ]
        )
    }

    validate() {
        const variablesItemsFlat = [
            ...this.normalVariables.getVariablesItemsFlat(),
            ...this.advancedVariables.getVariablesItemsFlat()
        ];
        let variables = [];
        for (let i = 0; i < variablesItemsFlat.length; i++) {
            const variable = variablesItemsFlat[i];
            const name = variable.getName();
            if (name === 'advanced') {
                alert(`Name: advanced can't use!`)
                return false
            }
            if (name === 'image') {
                alert(`Name: image can't use!`)
                return false
            }
            if (!variable.checkValidity()) {
                alert(`Variable: ${name} is not valid!`)
                return false
            }

            if (variables.includes(name)) {
                variable.setInvalid();
                alert(`Variable: ${name} exist multiple times!`)
                return false;
            }
            variables.push(name)
        }
        return true;
    }

    setData(data) {
        this.normalVariables.setData(data);
        if (data.hasOwnProperty('advanced'))
            this.advancedVariables.setData(data.advanced);
    }

    getData() {
        if (!this.validate) {
            return {};
        }
        const variables = this.normalVariables.getData();
        variables.advanced = this.advancedVariables.getData();
        return variables;
    }

    /**
     * Reset Tab
     */
    reset() {
        this.normalVariables.reset();
        this.advancedVariables.reset();
    }
}
