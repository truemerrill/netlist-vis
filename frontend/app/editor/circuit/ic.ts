import * as joint from "@joint/core";

export class IC extends joint.dia.Element {
  defaults(): joint.dia.Element.Attributes {
    return joint.util.defaultsDeep(
      {
        type: "custom.IC",
        markup: joint.util.svg`
      <rect @selector="body"/>
      <text @selector="label"/>
    `,
        size: { width: 100, height: 100 },
        attrs: {
          body: {
            refWidth: "100%",
            refHeight: "100%",
            fill: "#ffffff",
            stroke: "#000000",
            strokeWidth: 1,
          },
          label: {
            text: "IC",
            refX: "50%",
            refY: "50%",
            textAnchor: "middle",
            yAlignment: "middle",
            fontSize: 12,
            fill: "#000000",
          },
        },
        ports: {
          groups: {
            left: {
              position: { name: "left" },
              attrs: {
                pinBody: {
                  r: 4,
                  fill: "#444",
                  stroke: "#000",
                  strokeWidth: 1,
                },
                pinTooltip: {
                  text: "pinName",
                },
              },
              markup: joint.util.svg`
              <circle @selector="pinBody"/>
            `,
            },
            right: {
              position: { name: "right" },
              attrs: {
                pinBody: {
                  r: 4,
                  fill: "#444",
                  stroke: "#000",
                  strokeWidth: 1,
                },
                pinTooltip: {
                  text: "pinName",
                },
              },
              markup: joint.util.svg`
              <circle @selector="pinBody"/>
            `,
            },
          },
        },
      },
      super.defaults,
    );
  }

  static createWithPins(
    name: string,
    pins: { left: string[]; right: string[] },
  ) {
    const ic = new IC();
    ic.attr("label/text", name);
    ic.addPorts([
      ...pins.left.map((id) => ({
        id,
        group: "left",
        attrs: { pinBody: { title: id } },
      })),
      ...pins.right.map((id) => ({
        id,
        group: "right",
        attrs: { pinBody: { title: id } },
      })),
    ]);
    return ic;
  }
}
