import {$el} from "../../../../../scripts/ui.js";

export class AddVariableBtn {
  constructor(callback,
              textContent = "Add Variable",
              size = 15,
              rowSupport = true) {
    this.content = $el("button", {
      type: "button",
      style: {
        width: "100%",
        fontSize: `${size}px`
      },
      textContent: textContent,
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();

        let menuItems = [
          {
            title: "Bool",
            callback: () => {
              callback?.({
                type: "bool",
                name: "Bool Name"
              })
            }
          },
          {
            title: "Text",
            callback: () => {
              callback?.({
                type: "text",
                name: "Text Name"
              })
            }
          },
          {
            title: "Textarea",
            callback: () => {
              callback?.({
                type: "textarea",
                name: "Textarea Name"
              })
            }
          },
          {
            title: "Integer",
            callback: () => {
              callback?.({
                type: "int",
                name: "Integer Name"
              })
            }
          },
          {
            title: "Number",
            callback: () => {
              callback?.({
                type: "number",
                name: "Number Name"
              })
            }
          },
          {
            title: "Slider",
            callback: () => {
              callback?.({
                type: "slider",
                name: "Slider Name"
              })
            }
          },
          {
            title: "Seed",
            callback: () => {
              callback?.({
                type: "seed",
                name: "Seed Name"
              })
            }
          },
          {
            title: "Combo",
            callback: () => {
              callback?.({
                type: "combo",
                name: "Combo Name"
              })
            }
          },
          {
            title: "Model Combo",
            callback: () => {
              callback?.({
                type: "modelCombo",
                name: "Model combo Name"
              })
            }
          },
          {
            title: "Layer",
            callback: () => {
              callback?.({
                type: "layer",
                name: "Layer Name"
              })
            }
          }]

        if (rowSupport)
          menuItems.push({
            title: "Row",
            callback: () => {
              const rows = document.getElementsByClassName('laizypainter-variable-item-row');
              callback?.({
                type: "row",
                name: `row_${rows.length}`
              })
            }
          })
        menuItems.push({
          title: "Close"
        })
        LiteGraph.closeAllContextMenus();
        new LiteGraph.ContextMenu(
          menuItems,
          {
            event: e,
            scale: 1.3,
          },
          window
        );
      },
    })

  }
}
