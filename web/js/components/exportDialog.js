import {$el, ComfyDialog} from "../../../../../scripts/ui.js";

import {ConfigTab} from "./configTab.js";
import {VariablesTab} from "./variablesTab.js";
import {PromptTab} from "./promptTab.js";
import {TabManager} from "./tabManager.js";

export class ExportDialog extends ComfyDialog {
  tabManager;
  configTab;
  variablesTab;
  promptTab;

  /**
   * Export Dialog
   */
  constructor() {
    super();
    const self = this;

    self.configTab = new ConfigTab;
    self.variablesTab = new VariablesTab;
    self.promptTab = new PromptTab(self.variablesTab);

    self.tabManager = new TabManager([
      {
        label: "Config",
        content: self.configTab
      },
      {
        label: "Variables",
        content: self.variablesTab
      },
      {
        label: "Prompt",
        content: self.promptTab
      }
    ])
  }

  show() {
    const self = this;
    super.show(
      $el(
        "div",
        {
          style:
            {
              minWidth: '600px',
              minHeight: '500px',
              color: "var(--input-text)"
            }
        },
        [
          self.tabManager.render()
        ]
      )
    );
  }

  createButtons() {
    const self = this;
    const btns = super.createButtons();
    const exportBtn = $el("button", {
      type: "button",
      textContent: "Export",
      onclick: (e) => {
        if (self.variablesTab.validate()) {
          let exportLzy = {
            config: self.configTab.getData(),
            variables: self.variablesTab.getData(),
            prompt: self.promptTab.getData(),
          }
          console.log("export", exportLzy)
          self.downloadObjectAsFile(exportLzy, "task.lzy")
        }
      },
    });
    const importBtn = $el("button", {
      type: "button",
      textContent: "Import",
      onclick: (e) => {
        console.log("import")
        self.openFile()
      },
    });
    btns.unshift(importBtn);
    btns.unshift(exportBtn);
    return btns;
  }

  /**
   * Save object as File
   * https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
   * @param {any} exportObj
   * @param {string} exportName
   */
  downloadObjectAsFile(exportObj, exportName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  openFile() {
    const self = this;
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.lzy';
    input.onchange = _ => {
      let file = input.files[0];
      file.text().then(data => {
        const lzyData = JSON.parse(data);
        if (lzyData.hasOwnProperty('config'))
          console.log(lzyData)
      })
    };
    input.click();
  }
}
