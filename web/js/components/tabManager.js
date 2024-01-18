import {$el} from "../../../../../scripts/ui.js";

export class TabManager {
  tabs;
  tabButtons;

  /**
   * Tab Manager
   * @param {any} tabs
   */
  constructor(tabs) {
    this.tabs = tabs;
  }

  /**
   * Render Tab Manager
   * @returns {HTMLElement}
   */
  render() {
    const self = this;
    self.tabButtons = self.tabs.map((tab, i) => $el(
      "button", {
        type: "button",
        textContent: tab.label,
        style: {
          margin: "0 2px"
        },
        onclick: (e) => {
          self.switchTab(i)
        },
      })
    )
    const header = $el("div", {
      style: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "10px",
        paddingBottom: "5px"
      }
    }, self.tabButtons);
    const content = $el("div", {}, self.tabs.map(tab => $el(
      "div", {}, [tab.content?.content])
    ));
    self.switchTab(0);

    return $el("div", {}, [header, content]);
  }

  /**
   * Switch between tabs
   * @param {number} index
   */
  switchTab(index) {
    this.tabButtons.forEach((button, i) => {
      if (index === i)
        button.classList.add('laizypainter-btn-selected')
      else
        button.classList.remove('laizypainter-btn-selected')
    })
    this.tabs.forEach((tab, i) => {
      if (index === i)
        tab.content.content.classList.remove('laizypainter-tab-hidden')
      else
        tab.content.content.classList.add('laizypainter-tab-hidden')
    })
  }
}
