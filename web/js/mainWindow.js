import {mainStyle} from "./mainStyle.js";
import {$el} from "../../../../scripts/ui.js";
import {app} from "../../../scripts/app.js";

import {ExportDialog} from "./components/exportDialog.js";

app.registerExtension({
  name: "laizy.painter.exporter",
  init() {
    $el("style", {
      textContent: mainStyle,
      parent: document.head,
    });
  },
  setup() {
    const orig = LGraphCanvas.prototype.getCanvasMenuOptions;
    LGraphCanvas.prototype.getCanvasMenuOptions = function () {
      const options = orig.apply(this, arguments);

      options.push(null, {
        content: "LAizyPainter Export...",
        callback: () => {
          new ExportDialog().show();
        },
      });
      return options;
    };
  },
})
