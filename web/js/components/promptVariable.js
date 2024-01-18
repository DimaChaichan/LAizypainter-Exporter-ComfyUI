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
            self.defaultValue = self.input.value;
            self.input.value = `#${e.target.value}#`
          }
        }
      },
      [
        $el('option', {value: 'none', text: 'None'}),
        $el('option', {value: 'image', text: 'Image'})
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
   * @param {string} variable
   */
  addVariable(variable) {
    this.variable.appendChild($el('option', {value: variable, text: variable}))
  }

  /**
   * Change Variable in selection by index
   * @param {string} variable
   * @param {number} index
   */
  changeVariable(variable, index) {
    const oldValue = this.variable.children[index + 2].value;
    this.variable.children[index + 2].innerText = variable;
    this.variable.children[index + 2].value = variable;
    if (this.variable.selectedIndex === index + 2)
      this.input.value = this.input.value.replace(oldValue, variable)
  }

  /**
   * Remove variable in selection by index
   * @param index
   */
  removeVariable(index) {
    if (this.variable.selectedIndex === index + 2)
      this._restoreInput();
    this.variable.children[index + 2].remove()
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
