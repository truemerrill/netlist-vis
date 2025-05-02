import { CircuitComponent } from "./component";
import type { Attributes } from "./component";

export class IC extends CircuitComponent {
  defaults(): Partial<Attributes> {
    return {
      ...super.defaults(),
      type: "circuit.IC",
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
        },
        label: {
          text: "IC",
          refX: "50%",
          refY: "50%",
          textAnchor: "middle",
          yAlignment: "middle",
        },
      },
    };
  }
}
