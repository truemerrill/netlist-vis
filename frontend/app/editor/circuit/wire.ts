import { dia, util } from "@joint/core";

type ID = dia.Cell.ID;

export class Wire extends dia.Link {
  defaults() {
    return {
      ...super.defaults,
      type: "circuit.Wire",
      enabled: true,
      attrs: {
        line: {
          connection: true,
          strokeWidth: 2,
          strokeLinejoin: "round",
          targetMarker: {
            markup: "",
          },
        },
      },
    };
  }

  preinitialize(attributes?: dia.Link.Attributes | undefined): void {
    super.preinitialize(attributes);
    this.markup = util.svg`
      <path @selector="wrapper" fill="none" cursor="none" stroke="transparent" stroke-linecap="round"/>
      <path @selector="line" fill="none" pointer-events="none" />
    `;
  }

  static create(
    this: new (...args: any[]) => Wire,
    name: string,
    from: { id: ID; port: string },
    to: { id: ID; port: string },
  ): Wire {
    const classMap: Record<string, string> = {
      gnd: "circuit-wire circuit-wire-gnd",
      vcc: "circuit-wire circuit-wire-vcc",
      clk: "circuit-wire circuit-wire-clk",
      default: "circuit-wire",
    };

    const cssClass = classMap[name.toLowerCase()] ?? classMap.default;
    const wire = new this();

    wire.source(from);
    wire.target(to);

    wire.connector("jumpover", { size: 5 });
    wire.router("metro", {
      alwaysMove: true,
      step: 10,
      padding: 10,
    });

    // Add hoverable stroke and better hitbox
    wire.attr({
      ".": { class: cssClass },
      line: {
        stroke: "#444",
        strokeWidth: 2,
        pointerEvents: "none",
      },
      wrapper: {
        connection: true,
        stroke: "transparent",
        strokeWidth: 14,
        pointerEvents: "stroke",
        cursor: "pointer",
      },
    });

    wire.label(0, {
      attrs: {
        text: {
          text: name,
          fontSize: 12,
          fill: "#000",
          class: "wire-label",
        },
        rect: {
          stroke: "none",
        },
      },
      position: {
        distance: 0.5,
        offset: 0,
      },
    });

    // Set the class on the <g> wrapper
    wire.attr(".", { class: cssClass });

    return wire;
  }
}
