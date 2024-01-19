import {$el} from "../../../../../scripts/ui.js";

export class PromptVariable {
    key;
    node;
    defaultValue;
    type;

    /**
     * PromptVariable Component
     * @param {string} key
     * @param {string | number} input
     * @param  {string} node
     */
    constructor(key, input, node) {
        const self = this;
        self.key = key;
        self.node = node;
        self.defaultValue = input;
        self.type = typeof input === 'string' ? 'text' : 'number';

        self.input = $el("input", {
            value: input,
            required: true,
            type: self.type,
            style: {
                width: "100%",
                display: "flex"
            }
        })
        self.variable = $el(
            "select",
            {
                style: {
                    width: "100%",
                    display: "flex"
                },
                onchange: (e) => {
                    if (e.target.value === "none") {
                        self._restoreInput();
                    } else {
                        self.input.type = "text";
                        self.input.value = `#${e.target.value}#`
                    }
                }
            },
            [
                $el('option', {
                    dataset: {
                        id: "none"
                    }, value: 'none', text: 'None'
                }),
                $el('option', {
                    dataset: {
                        id: "image"
                    }, value: 'image', text: 'Image'
                })
            ]
        )
        self.content = $el("div", {
                style: {
                    width: "100%",
                    display: "flex"
                }
            },
            [self.input, self.variable])
    }

    /**
     * Add variable to selection
     * @param {string} id
     * @param {string} variable
     */
    addVariable(id, variable) {
        this.variable.appendChild($el('option', {
            dataset: {
                id: id
            },
            value: variable,
            text: variable
        }))
    }

    /**
     * Change Variable in selection by index
     * @param {string} id
     * @param {string} variable
     */
    changeVariable(id, variable) {
        for (let i = 0; i < this.variable.children.length; i++) {
            const variableOption = this.variable.children[i];
            if (variableOption.dataset.id === id) {
                const oldValue = variableOption.value;
                variableOption.innerText = variable;
                variableOption.value = variable;
                if (this.variable.selectedIndex === i)
                    this.input.value = this.input.value.replace(oldValue, variable)
            }
        }
    }

    /**
     * Remove variable in selection by index
     * @param {string} id
     */
    removeVariable(id) {
        for (let i = 0; i < this.variable.children.length; i++) {
            const variableOption = this.variable.children[i];
            if (variableOption.dataset.id === id) {
                if (this.variable.selectedIndex === i)
                    this._restoreInput();
                variableOption.remove()
            }
        }
    }

    /**
     * Reset Variable
     */
    reset() {
        this.variable.value = 'none';
        for (let i = 0; i < this.variable.children.length; i++) {
            const variableOption = this.variable.children[i];
            if (variableOption.dataset.id !== "none" && variableOption.dataset.id !== "image")
                this.variable.children[i].remove();
        }
        this._restoreInput();
    }

    /**
     * Get Data
     * @returns {{node, value: string, key}}
     */
    getData() {
        return {
            node: this.node,
            key: this.key,
            value: this.input.value,
        };
    }

    /**
     * Restore Input
     * @private
     */
    _restoreInput() {
        this.input.type = this.type;
        this.input.value = this.defaultValue;
    }
}
