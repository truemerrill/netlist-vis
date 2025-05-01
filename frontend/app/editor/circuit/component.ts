import { dia, util } from "@joint/core";
import {
  BG_COLOR,
  PIN_BG_COLOR,
  PIN_STROKE_COLOR,
  PIN_LABEL_COLOR,
  FONT_SIZE,
  PIN_FONT_SIZE,
  STROKE_COLOR,
  LABEL_COLOR,
} from "../theme";

export type Attributes = dia.Element.Attributes;

//** Whether the pin is on the left or right side */
export type Side = "left" | "right";

const MIN_HEIGHT = 60;
const MIN_PIN_SPACING = 20;


//** Utility function to draw pins (Ports in JointJS parlance) */
function createPort(id: string, side: Side): dia.Element.Port {
  return {
    id: id,
    group: side,
    attrs: {
      portRoot: {
        magnetSelector: "portBody",
      },
      portBody: {
        magnet: "passive",
        r: 5,
        stroke: PIN_STROKE_COLOR,
        strokeWidth: 1,
        fill: PIN_BG_COLOR,
      },
      portLabel: {
        text: id,
        fill: PIN_LABEL_COLOR,
        fontSize: PIN_FONT_SIZE,
        x: side === "left" ? -6 : 6,
        y: side === "left" ? -4 : 4,
        textVerticalAnchor: side === "left" ? "bottom" : "top",
        textAnchor: side === "left" ? "end" : "start",
      },
    },
    markup: util.svg`
      <circle @selector="portBody" />
      <text @selector="portLabel" />                
    `,
    label: {
      markup: [],
    },
  };
}


export abstract class CircuitComponent extends dia.Element<Attributes> {
  defaults(): Partial<Attributes> {
    return {
      body: {
        refWidth: "100%",
        refHeight: "100%",
        fill: BG_COLOR,
        stroke: STROKE_COLOR,
        strokeWidth: 1,
      },
      label: {
        refX: "50%",
        refY: "50%",
        textAnchor: "middle",
        yAlignment: "middle",
        fontSize: FONT_SIZE,
        fill: LABEL_COLOR,
      },
      ports: {
        groups: {
          left: {
            position: {
              name: "left",
            },
          },
          right: {
            position: {
              name: "right",
            },
          },
        },
      },
    };
  }

  /**
   * Creates a new instance of the component with the given label and pin configuration.
   *
   * This method should be called on a subclass of `CircuitComponent` (e.g., `IC.create(...)`)
   * and will automatically configure:
   * - the label text
   * - the set of left and right pins
   * - appropriate port attributes for each pin
   *
   * @template T The subclass of `CircuitComponent` being instantiated.
   * @param this The constructor function of the subclass. Inferred automatically.
   * @param name The label text to display in the center of the component.
   * @param pins An object containing arrays of pin IDs to place on the `left` and `right` sides.
   * @returns A new instance of the subclass, configured with the specified label and pins.
   */
  static create<T extends CircuitComponent>(
    this: new (...args: any[]) => T,
    name: string,
    pins: { left: string[]; right: string[] }
  ) {
    const maxCount = Math.max(pins.left.length, pins.right.length);
    const height = Math.max(MIN_HEIGHT, (maxCount + 1) * MIN_PIN_SPACING);

    const obj = new this();
    obj.resize(60, height);
    obj.attr("label/text", name);
    obj.addPorts([
      ...pins.left.map(id => createPort(id, "left")),
      ...pins.right.map(id => createPort(id, "right")),
    ]);
    return obj;
  }
}
