import {$el} from "../../../../../scripts/ui.js";
import {AddVariableBtn} from "./addVariableBtn.js";

export class Variable {
  content;
  nameInput;
  type;
  rowVariables = [];

  /**
   * Variable Item Component
   * @param {type: string, name: string, settings: any} variable
   * @param {(res) => void} onChange
   * @param {(res) => void} onRemove
   */
  constructor(variable, onChange, onRemove) {
    const self = this;
    self.type = variable.type;
    self.nameInput = $el("input.laizypainter-variable-input", {
      value: variable.name,
      required: true,
      onchange: (e) => {
        const index = Array.prototype.indexOf.call(self.content.parentElement.children, self.content)
        onChange?.({value: e.target.value, index: index})
      }
    })
    if (variable.type !== 'row') {
      let res = [
        $el("div", {
          style:
            {
              width: '100%',
            }
        }, [
          $el("label", {
            style: {
              textTransform: "capitalize"
            }
          }, [
            variable.type
          ])
        ]),
        $el("div", {
          style:
            {
              width: '100%',
              display: 'flex'
            }
        }, [
          $el("label", {
            style: {
              textTransform: "capitalize",
              paddingRight: "5px"
            }
          }, [
            "Name:"
          ]),
          self.nameInput,
          $el("div.laizypainter-close-btn", {
            onclick: (e) => {
              const index = Array.prototype.indexOf.call(self.content.parentElement.children, self.content)
              onRemove?.({index: index})
              self.content.remove();
            },
          })
        ])
      ];
      res.push(self.renderSettings(variable.type))
      self.content = $el('div.laizypainter-variable-item', {}, res)
    } else {
      self.rowContent = $el("div", {
        style:
          {
            width: '100%',
            display: "flex"
          }
      });
      self.content = $el('div.laizypainter-variable-item-row', {}, [
        $el("div", {
          style:
            {
              width: '100%',
            }
        }, [
          $el("label", {
            style: {
              textTransform: "capitalize"
            }
          }, [
            variable.type
          ])
        ]),
        self.rowContent,
        new AddVariableBtn(
          (res) => {
            const newVariable = new Variable(res, onChange,
              (res) => {
                self.rowVariables.splice(res.index, 1);
              });
            self.rowVariables.push(newVariable);
            self.rowContent.appendChild(newVariable.content)
          }, "Add Variable to row", 15).content])
    }
  }

  renderSettings(type) {
    const self = this;
    const settingsComp = [];
    let possibleSettings = [];
    let defaultValue = 'defaultValue';
    let defaultValueType = 'text';

    switch (type) {
      case "bool":
        defaultValueType = "checkbox";
      case "text":
      case "textarea":
      case "modelCombo":
        possibleSettings.push({
          title: "Restore",
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        break;
      case "int":
      case "number":
      case "slieder":
        possibleSettings.push({
          title: "Restore",
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        possibleSettings.push({
          title: "Min",
          callback: () => {
            self.renderSetting("number", "Min", 0, 'min')
          }
        })
        possibleSettings.push({
          title: "Max",
          callback: () => {
            self.renderSetting("number", "Max", 10, 'max')
          }
        })
        possibleSettings.push({
          title: "Steps",
          callback: () => {
            self.renderSetting("number", "Steps", 1, 'steps')
          }
        })
        defaultValueType = "number";
        defaultValue = 0;
        break;
      case "seed":
        possibleSettings.push({
          title: "Restore",
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        possibleSettings.push({
          title: "Max",
          callback: () => {
            self.renderSetting("number", "Max", 10, 'max')
          }
        })
        defaultValueType = "number";
        defaultValue = -1;
        break;
      case "combo":
        possibleSettings.push({
          title: "Restore",
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        possibleSettings.push({
          title: "option",
          callback: () => {
            self.renderSetting("text", "Option", 'Option', 'option', false)
          }
        })
        break;
    }

    settingsComp.push(
      $el("div", {
        style:
          {
            width: '100%',
            display: 'flex',
          }
      }, [
        $el("label", {
          style: {
            textTransform: "capitalize",
            paddingRight: "5px"
          }
        }, [
          "Label:"
        ]),
        $el("input", {
          value: "Label",
          required: true,
          dataset: {
            settings: 'label'
          },
        })
      ])
    )
    if (type !== "layer")
      settingsComp.push($el("div", {
        style:
          {
            width: '100%',
            display: 'flex',
          }
      }, [
        $el("label", {
          style: {
            textTransform: "capitalize",
            paddingRight: "5px"
          }
        }, [
          "Default Value:"
        ]),
        $el("input", {
          value: defaultValue,
          required: true,
          dataset: {
            settings: 'value'
          },
          type: defaultValueType,
          checked: type === "checkbox" ? defaultValueType : null
        })
      ]))

    if (type === "modelCombo") {
      settingsComp.push(
        $el("div", {
          style:
            {
              width: '100%',
              display: 'flex',
            }
        }, [
          $el("label", {
            style: {
              textTransform: "capitalize",
              paddingRight: "5px"
            }
          }, [
            "Type:"
          ]),

          $el(
            "select",
            {
              dataset: {
                settings: 'type'
              },
            },
            [
              $el('option', {value: 'model', text: 'model'}),
              $el('option', {value: 'clip', text: 'clip'}),
              $el('option', {value: 'clipVision', text: 'clipVision'}),
              $el('option', {value: 'controlnet', text: 'controlnet'}),
              $el('option', {value: 'diffusers', text: 'diffusers'}),
              $el('option', {value: 'embeddings', text: 'embeddings'}),
              $el('option', {value: 'gligen', text: 'gligen'}),
              $el('option', {value: 'hypernetworks', text: 'hypernetworks'}),
              $el('option', {value: 'loras', text: 'loras'}),
              $el('option', {value: 'styleModels', text: 'styleModels'}),
              $el('option', {value: 'upscaleModels', text: 'upscaleModels'}),
              $el('option', {value: 'vae', text: 'vae'}),
            ]
          )])
      )
    }

    self.settings = $el("div", {
      style:
        {
          width: '100%',
          display: 'flex',
          flexDirection: "column"
        }
    }, settingsComp)

    let container = [self.settings]
    if (possibleSettings.length)
      container.push($el("button", {
        style: {
          fontSize: "15px"
        },
        type: "button",
        textContent: "Add Setting",
        onclick: (e) => {
          e.preventDefault();
          e.stopPropagation();

          LiteGraph.closeAllContextMenus();
          new LiteGraph.ContextMenu(
            possibleSettings,
            {
              event: e,
              scale: 1.3,
            },
            window
          );
        },
      }))

    return $el("div", {
      style:
        {
          width: '100%',
          display: 'flex',
          flexDirection: "column",
          borderTop: '1px solid var(--border-color)',
          marginTop: "5px",
          paddingTop: "5px"
        }
    }, container)
  }

  renderSetting(type, label, value, setting, check = true) {
    const self = this;
    if (!self.settings)
      return
    if (check) {
      const checkSettingExist = self.settings.querySelectorAll(`[data-settings=${setting}]`)
      if (checkSettingExist.length) {
        alert(`Setting: ${label} can only occur once!`)
        return;
      }
    }
    self.settings.appendChild($el("div", {
      style:
        {
          width: '100%',
          display: 'flex',
        }
    }, [
      $el("div.laizypainter-close-btn", {
        onclick: (e) => {
          e.target.parentElement.remove();
        },
      }),
      $el("label", {
        style: {
          textTransform: "capitalize",
          paddingRight: "5px"
        }
      }, [
        `${label}:`
      ]),
      $el("input", {
        value: value,
        required: true,
        dataset: {
          settings: setting
        },
        type: type,
        checked: type === "checkbox" ? value : null
      })
    ]))
  }

  getRowVariables() {
    if (this.type !== "row")
      return [];
    return this.rowVariables;
  }

  getName() {
    return this.nameInput.value;
  }

  setInvalid() {
    this.nameInput.classList.add('laizypainter-variable-input-error');
  }

  checkValidity() {
    if (this.type === "row")
      return true
    const input = this.nameInput;
    input.classList.remove('laizypainter-variable-input-error')
    if (!input.checkValidity()) {
      input.classList.add('laizypainter-variable-input-error')
      return false;
    }
    return true;
  }

  getData() {
    const self = this;
    const settings = {
      type: self.type
    };
    if (self.type === "row") {
      for (let i = 0; i < self.rowVariables.length; i++) {
        const variable = self.rowVariables[i];
        const name = variable.getName();
        settings[name] = variable.getData();
      }
    } else {
      const settingInputs = this.settings.getElementsByTagName('input');
      if (self.type === "modelCombo") {
        const modelSelect = this.settings.getElementsByTagName('select');
        settings.type = modelSelect[0].value;
      }
      Array.from(settingInputs).forEach(
        setting => {
          let value = setting.type === "checkbox" ? setting.checked : setting.value;
          settings[setting.dataset.settings] = setting.type === "number" ? parseFloat(value) : value
        });
    }
    return settings;
  }
}
