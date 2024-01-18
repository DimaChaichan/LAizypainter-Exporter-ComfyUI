import {$el} from "../../../../../scripts/ui.js";

export class ConfigTab {
  content;
  label;
  mode;

  /**
   * Config Tab
   */
  constructor() {
    this.label = $el("input", {
      value: "Taskname",
      required: true
    })
    this.mode = $el(
      "select",
      {},
      [
        $el('option', {value: 'loop', text: 'Loop'}),
        $el('option', {value: 'single', text: 'Single'})
      ]
    )
    this.content = $el(
      "div",
      {},
      [
        $el(
          "div",
          {},
          [
            $el(
              "div",
              {},
              [
                $el("label", {
                  style: {
                    paddingRight: "15px"
                  }
                }, ['Name:']),
                this.label
              ]
            )
          ]
        ),
        $el(
          "div",
          {},
          [
            $el(
              "div",
              {},
              [
                $el("label", {
                  style: {
                    paddingRight: "11px"
                  }
                }, ['Mode:']),
                this.mode
              ]
            )
          ]
        )
      ]
    )
  }

  /**
   * Get Config Data
   * @returns {{mode, label: (boolean|*)}}
   */
  getData() {
    return {
      label: this.label.value === "" ? false : this.label.value,
      mode: this.mode.value
    }
  }
}
