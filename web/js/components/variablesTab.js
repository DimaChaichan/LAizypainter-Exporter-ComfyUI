import {$el} from "../../../../../scripts/ui.js";
import {Variable} from "./variable.js";
import {AddVariableBtn} from "./addVariableBtn.js";

export class VariablesTab {
  content;
  variablesContainer;

  handlers = [];
  variableItems = [];

  constructor() {
    const self = this;
    self.variablesContainer = $el(
      "div",
      {},
    )
    self.content = $el(
      "div.laizypainter-tab-hidden",
      {},
      [self.variablesContainer, new AddVariableBtn(
        (res) => self.addVariable(res)).content]
    )
  }

  addVariable(variable) {
    const self = this;
    const newVariableItem = new Variable(variable,
      (res) => self._trigger("changeItem", res),
      (res) => {
        self.variableItems.splice(res.index, 1)
        self._trigger("removeItem", res)
      })
    self.variablesContainer.appendChild(newVariableItem.content);
    self.variableItems.push(newVariableItem);
    self._trigger("addItem", variable);
  }

  getVariablesItemsFlat() {
    let variablesItemsFlat = [];
    for (let i = 0; i < this.variableItems.length; i++) {
      const variable = this.variableItems[i];
      if (variable.type === "row") {
        variablesItemsFlat.push(...variable.getRowVariables());
      } else {
        variablesItemsFlat.push(variable);
      }
    }
    return variablesItemsFlat;
  }

  validate() {
    const self = this;
    let variablesItemsFlat = this.getVariablesItemsFlat();
    let variables = [];

    for (let i = 0; i < variablesItemsFlat.length; i++) {
      const variable = variablesItemsFlat[i];
      const name = variable.getName();
      console.log("name", name)
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

  getData() {
    const self = this;
    let variables = {};
    if (!self.validate) {
      return variables;
    }
    for (let i = 0; i < self.variableItems.length; i++) {
      const variable = self.variableItems[i];
      const name = variable.getName();
      variables[name] = variable.getData();
    }
    return variables;
  }

  /**
   * Bind to Events
   * @param {"addItem" | "removeItem" | "changeItem"} type
   * @param {(res) => void} callback
   */
  bind(type, callback) {
    this.handlers.push({type: type, callback: callback})
  }

  /**
   * Trigger Event
   * @param {"addItem" | "removeItem" | "changeItem"} type
   * @param value
   * @private
   */
  _trigger(type, value) {
    this.handlers.forEach(handler => {
      if (handler.type === type)
        handler.callback(value);
    })
  }
}
