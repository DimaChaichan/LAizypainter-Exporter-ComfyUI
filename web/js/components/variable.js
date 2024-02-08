import {$el} from "../../../../../scripts/ui.js";
import {AddVariableBtn} from "./addVariableBtn.js";

export class Variable {
  id;
  content;
  nameInput;
  type;
  possibleSettings = [];
  rowVariables = [];

  onChange;
  onRemove;
  onMove;
  onAddToRow;

  /**
   * Variable Item Component
   * @param {type: string, name: string, settings: any} variable
   * @param {string} id
   * @param {(res) => void} onChange
   * @param {(res) => void} onRemove
   * @param {(res : {type: string, name: string}) => void} onAddToRow
   */
  constructor(variable, id, onChange, onRemove, onMove, onAddToRow) {
    const self = this;
    self.id = id;
    self.type = variable.type;

    self.onChange = onChange;
    self.onRemove = onRemove;
    self.onMove = onMove;
    self.onAddToRow = onAddToRow;

    self.nameInput = $el("input.laizypainter-variable-input", {
      value: variable.name,
      required: true,
      onchange: (e) => {
        onChange?.({value: e.target.value, id: self.id})
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
          $el("div.laizypainter-down-btn", {
            onclick: (e) => {
              const index = Array.from(self.content.parentNode.children).indexOf(self.content)
              if (index >= Array.from(self.content.parentNode.children).length - 1)
                return
              self.content.parentNode.insertBefore(self.content.parentNode.children[index + 1], self.content);
              self.onMove?.({index: index, dir: "down"});
            },
            style: {
              position: "absolute",
              right: "42px",
              top: "0",
              borderRadius: "3px",
              height: "20px"
            }
          }),
          $el("div.laizypainter-up-btn", {
            onclick: (e) => {
              const index = Array.from(self.content.parentNode.children).indexOf(self.content)
              if (index === 0)
                return
              self.content.parentNode.insertBefore(self.content, self.content.parentNode.children[index - 1]);
              self.onMove?.({index: index, dir: "up"});
            },
            style: {
              position: "absolute",
              right: "16px",
              top: "0",
              borderRadius: "3px",
              height: "20px"
            }
          }),
          $el("div.laizypainter-close-btn", {
            onclick: (e) => {
              const response = confirm("Are you sure?");
              if (response) {
                onRemove?.(self.id);
                self.content.remove();
              }
            },
            style: {
              position: "absolute",
              right: "-10px",
              top: "0",
              borderRadius: "3px",
              height: "20px"
            }
          })
        ])
      ];
      res.push(self.renderSettings(variable.type))
      self.content = $el('div.laizypainter-variable-item', {}, $el("div", {
        style:
          {
            margin: "5px"
          }
      }, res))
    } else {
      self.rowContent = $el("div.laizypainter-variable-item-row-items", {
        style:
          {
            maxWidth: 'calc(100vh - 50px)',
            display: "flex",
            overflow: 'auto'
          }
      });
      self.content = $el('div.laizypainter-variable-item-row', {}, [
        $el("div", {
          style:
            {
              margin: "5px"
            }
        }, [
          $el("label", {
            style: {
              textTransform: "capitalize"
            }
          }, [
            variable.type
          ]),
          $el("div.laizypainter-up-btn", {
            onclick: (e) => {
              const index = Array.from(self.content.parentNode.children).indexOf(self.content)
              if (index === 0)
                return
              self.content.parentNode.insertBefore(self.content, self.content.parentNode.children[index - 1]);
              self.onMove?.({index: index, dir: "up"});
            },
            style: {
              position: "absolute",
              right: "16px",
              top: "0",
              borderRadius: "3px",
              height: "20px"
            }
          }),
          $el("div.laizypainter-down-btn", {
            onclick: (e) => {
              const index = Array.from(self.content.parentNode.children).indexOf(self.content)
              if (index >= Array.from(self.content.parentNode.children).length - 1)
                return
              self.content.parentNode.insertBefore(self.content.parentNode.children[index + 1], self.content);
              self.onMove?.({index: index, dir: "down"});
            },
            style: {
              position: "absolute",
              right: "42px",
              top: "0",
              borderRadius: "3px",
              height: "20px"
            }
          }),
          $el("div.laizypainter-close-btn", {
            onclick: (e) => {
              const response = confirm("Are you sure?");
              if (response) {
                self.rowVariables.forEach(variable => {
                  onRemove?.(variable.id)
                })

                onRemove?.(self.id)
                self.content.remove();
                onRemove?.(self.id)
                self.content.remove();
              }
            },
            style: {
              position: "absolute",
              right: "-10px",
              top: "0",
              borderRadius: "3px",
              height: "20px"
            }
          })
        ]),
        self.rowContent,
        new AddVariableBtn(
          (res) => {
            self.addVariableToRow(res);
          }, "Add Variable to row", 15, false).content])
    }
  }

  renderSettings(type) {
    const self = this;
    const settingsComp = [];
    this.possibleSettings = [];
    let defaultValue = 'defaultValue';
    let defaultValueType = 'text';

    switch (type) {
      case "bool":
        defaultValueType = "checkbox";
      case "text":
      case "textarea":
      case "modelCombo":
        this.possibleSettings.push({
          title: "Restore",
          key: 'restore',
          type: 'checkbox',
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        break;
      case "int":
      case "number":
      case "slider":
        this.possibleSettings.push({
          title: "Restore",
          key: 'restore',
          type: 'checkbox',
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        this.possibleSettings.push({
          title: "Min",
          key: 'min',
          type: 'number',
          callback: () => {
            self.renderSetting("number", "Min", 0, 'min')
          }
        })
        this.possibleSettings.push({
          title: "Max",
          key: 'max',
          type: 'number',
          callback: () => {
            self.renderSetting("number", "Max", 10, 'max')
          }
        })
        this.possibleSettings.push({
          title: "Steps",
          key: 'step',
          type: 'number',
          callback: () => {
            self.renderSetting("number", "Steps", 1, 'step')
          }
        })
        defaultValueType = "number";
        defaultValue = 0;
        break;
      case "seed":
        this.possibleSettings.push({
          title: "Restore",
          key: 'restore',
          type: 'checkbox',
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        this.possibleSettings.push({
          title: "Max",
          key: 'max',
          type: 'number',
          callback: () => {
            self.renderSetting("number", "Max", 10, 'max')
          }
        })
        defaultValueType = "number";
        defaultValue = -1;
        break;
      case "combo":
        this.possibleSettings.push({
          title: "Restore",
          key: 'restore',
          type: 'checkbox',
          callback: () => {
            self.renderSetting("checkbox", "Restore", true, 'restore')
          }
        })
        this.possibleSettings.push({
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
    if (this.possibleSettings.length) {
      this.possibleSettings.push({
        title: "Close"
      })
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
            this.possibleSettings,
            {
              event: e,
              scale: 1.3,
            },
            window
          );
        },
      }))
    }

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

  addVariableToRow(data) {
    const self = this;
    const newVariable = new Variable(
      data,
      Math.floor(Math.random() * 1000).toString(),
      self.onChange,
      (res) => {
        const removeIndex = self.rowVariables.findIndex(item => item.id === res)
        if (removeIndex > -1) {
          self.rowVariables.splice(removeIndex, 1)
        }
        self.onRemove?.(res)
      }, (res) => {
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
        const b = self.rowVariables[currentIndex];
        self.rowVariables[currentIndex] = self.rowVariables[moveIndex];
        self.rowVariables[moveIndex] = b;
      });
    self.rowVariables.push(newVariable);
    self.rowContent.appendChild(newVariable.content)
    self.onAddToRow?.(newVariable);
    return newVariable;
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

  setData(data) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = data[key];

      if (key === 'label') {
        this.settings.querySelector('[data-settings=label]').value = value
      } else if (key === 'value') {
        this.settings.querySelector('[data-settings=value]').value = value
      } else if (this.type === "row" && typeof value === 'object') {
        const variableConfig = {
          type: value.type,
          name: key
        }
        const importedRowVariable = this.addVariableToRow(variableConfig);
        importedRowVariable.setData(value);
      } else if (this.type === "combo" && key === 'options') {
        value.forEach(option => this.renderSetting("text", "Option", option, 'option', false))
      } else {
        const check = this.possibleSettings.find(setting => setting.key === key);
        if (check) {
          this.renderSetting(check.type, check.title, value, key)
        }
      }
    }
  }

  getData() {
    const self = this;
    const settings = {
      type: self.type
    };
    if (self.type === "combo")
      settings.options = [];
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
          if (self.type === "combo" && setting.dataset.settings === "option")
            settings.options.push(value);
          else
            settings[setting.dataset.settings] = setting.type === "number" ? parseFloat(value) : value
        });
    }
    return settings;
  }

  /**
   * Destroy Variable
   */
  destroy() {
    this.content.remove();
  }
}
