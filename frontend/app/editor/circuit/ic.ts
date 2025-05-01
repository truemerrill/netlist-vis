import { CircuitComponent } from "./component";
import type { Attributes } from "./component";

import {
  FONT_SIZE,
  IC_BG_COLOR,
  IC_STROKE_COLOR,
  IC_LABEL_COLOR
} from "../theme";

export class IC extends CircuitComponent {
  defaults(): Partial<Attributes> {
    return {
      ...super.defaults(),
      type: "circuit.IC",
      size: {
        width: 75,
        height: 150,
      },
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        body: {
          refWidth: "100%",
          refHeight: "100%",
          fill: IC_BG_COLOR,
          stroke: IC_STROKE_COLOR,
          strokeWidth: 1,
        },
        label: {
          text: "IC",
          refX: "50%",
          refY: "50%",
          textAnchor: "middle",
          yAlignment: "middle",
          fontSize: FONT_SIZE,
          fill: IC_LABEL_COLOR,
        },
      },
    };
  }
}
