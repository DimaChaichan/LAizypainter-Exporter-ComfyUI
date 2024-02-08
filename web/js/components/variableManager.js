import {$el} from "../../../../../scripts/ui.js";
import {Variable} from "./variable.js";
import {AddVariableBtn} from "./addVariableBtn.js";

export class VariablesManager {
  content;
  variablesContainer;

  handlers = [];
  variableItems = [];

  constructor(name) {
    const self = this;
    self.variablesContainer = $el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }
      },
    )
    self.content = $el(
      "div",
      {
        style: {
          marginBottom: "10px"
        }
      },
      [
        $el("label", {
          style: {
            paddingRight: "15px",
            marginBottom: "3px"
          }
        }, [name]),
        self.variablesContainer, new AddVariableBtn(
        (res) => self.addVariable(res)).content]
    )
  }

  addVariable(variable, append = true) {
    const self = this;
    const id = (Date.now() + Math.floor(Math.random() * 100)).toString();
    const newVariableItem = new Variable(
      variable,
      id,
      (res) => self._trigger("changeItem", res),
      (res) => {
        const removeIndex = self.variableItems.findIndex(item => item.id === res)
        if (removeIndex > -1) {
          self.variableItems.splice(removeIndex, 1)
        }
        self._trigger("removeItem", res)
      },
      (res) => {
        const currentIndex = res.index;
        let moveIndex = currentIndex;
        switch (res.dir) {
          case 'up':
            moveIndex--;
            break
          case 'down':
            moveIndex++;
            break
        }
        const b = self.variableItems[currentIndex];
        self.variableItems[currentIndex] = self.variableItems[moveIndex];
        self.variableItems[moveIndex] = b;

        self._trigger("moveItem", res)
      },
      (res) => {
        self._trigger("addItem", {
          id: res.id,
          variable: {type: res.type, name: res.getName()}
        });
      })
    if (append)
      self.variablesContainer.appendChild(newVariableItem.content);
    self.variableItems.push(newVariableItem);
    self._trigger("addItem", {
      id: id,
      variable: variable
    });
    return newVariableItem;
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

  setData(data) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const variable = data[key];
      const variableConfig = {
        type: variable.type,
        name: key
      }
      if (variableConfig.type && variableConfig.name) {
        const importedVariable = this.addVariable(variableConfig);
        importedVariable.setData(variable);
      }
    }
  }

  getData() {
    const self = this;
    let variables = {};
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
   * Reset Tab
   */
  reset() {
    this.variableItems.forEach(variable => variable.destroy())
    this.variableItems = [];
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
