import {$el} from "../../../../../scripts/ui.js";
import {PromptVariable} from "./promptVariable.js";
import {VariablesTab} from "./variablesTab.js";

export class PromptTab {
    content;
    apiPrompt = {};
    normalVariablesManager;
    advancedVariablesManager;
    variablesSelections = [];

    /**
     * Prompt Tab Component
     * @param {VariablesTab} variablesTab
     */
    constructor(variablesTab) {
        const self = this;
        self.normalVariablesManager = variablesTab.normalVariables;
        self.advancedVariablesManager = variablesTab.advancedVariables;
        self.content = $el(
            "div",
            {
                style: {
                    display: "flex",
                    flexDirection: "column"
                }
            }
        )
        app.graphToPrompt().then(p => {
            self.apiPrompt = p.output;
            self.render();
        });

        self.normalVariablesManager.bind("addItem", (res) => {
            if (res.variable.type !== "row")
                self.variablesSelections.forEach(variable => variable.addVariable(res.id, res.variable.name))
        })
        self.normalVariablesManager.bind("changeItem", (res) => {
            self.variablesSelections.forEach(variable => variable.changeVariable(res.id, res.value))
        })
        self.normalVariablesManager.bind("removeItem", (res) => {
            self.variablesSelections.forEach(variable => variable.removeVariable(res))
        })

        self.advancedVariablesManager.bind("addItem", (res) => {
            if (res.variable.type !== "row")
                self.variablesSelections.forEach(variable => variable.addVariable(res.id, res.variable.name))
        })
        self.advancedVariablesManager.bind("changeItem", (res) => {
            self.variablesSelections.forEach(variable => variable.changeVariable(res.id, res.value))
        })
        self.advancedVariablesManager.bind("removeItem", (res) => {
            self.variablesSelections.forEach(variable => variable.removeVariable(res))
        })

    }

    /**
     * Render Prompt Tab
     */
    render() {
        const self = this;
        if (!self.apiPrompt)
            return;

        const nodes = Object.keys(self.apiPrompt);
        nodes.forEach(node => {
            const inputs = Object.keys(self.apiPrompt[node].inputs);
            const class_type = self.apiPrompt[node].class_type;
            let inputItems = []

            inputs.forEach(input => {
                const inputValue = self.apiPrompt[node].inputs[input]
                // Ignore some Values
                if (class_type === "LoadImage" && input === "choose file to upload")
                    return
                if (typeof inputValue !== "object") {
                    const selection = new PromptVariable(input, inputValue, node);
                    self.variablesSelections.push(selection);

                    inputItems.push($el("div", {
                        style: {
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                        }
                    }, [
                        $el("label", {
                            style: {
                                textTransform: "capitalize",
                                paddingRight: "5px"
                            }
                        }, [`${input}:`]),
                        selection.content
                    ]))
                }
            })

            if (inputItems.length)
                self.content.appendChild($el("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                    }
                }, [
                    $el("label", {
                        style: {
                            textTransform: "capitalize"
                        }
                    }, [class_type]),
                    $el(
                        "div",
                        {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                padding: "5px 5px 5px 15px",
                                borderTop: "1px solid var(--border-color)",
                                marginTop: "3px"
                            }
                        },
                        inputItems
                    )
                ]))
        })
    }

    /**
     * Get Prompt Data
     * @returns {any}
     */
    getData() {
        let apiPrompt = JSON.parse(JSON.stringify(this.apiPrompt));
        const inputData = this.variablesSelections.map(variable => variable.getData())
        inputData.forEach(data => {
            if (apiPrompt[data.node]) {
                apiPrompt[data.node].inputs[data.key] = data.value
            }
        })
        return apiPrompt;
    }

    /**
     * Resset Tab
     */
    reset() {
        this.variablesSelections.forEach(variable => variable.reset())
    }
}
