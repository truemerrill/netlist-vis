import { useEffect, useRef, useState } from "react";
import * as joint from "@joint/core";

import "./editor.css";
import type { Netlist } from "./types.d.ts";
import createCircuitComponent from "./circuit";

// Test data - replace with API call
import data from "./netlist.json";
const netlist: Netlist = data;


/**
 * Render a Netlist into a JointJS graph.
 *
 * @param graph - The JointJS graph to populate
 * @param netlist - The structured netlist object
 */
function renderNetlistToGraph(graph: joint.dia.Graph, netlist: Netlist): void {
  // Map of component ID → dia.Element
  const componentMap: Record<string, joint.dia.Element> = {};

  // 1. Add all components to the graph
  Object.entries(netlist.components).forEach(([name, def], index) => {
    const element = createCircuitComponent(name, def);

    // Position them with spacing
    element.position(
      100 + (index % 4) * 150,
      100 + Math.floor(index / 4) * 200
    );

    graph.addCell(element);
    componentMap[name] = element;
  });

  // 2. Add links for each net
  Object.entries(netlist.connections).forEach(([netName, connections]) => {
    for (let i = 0; i < connections.length - 1; i++) {
      const from = connections[i];
      const to = connections[i + 1];

      const fromElement = componentMap[from.component];
      const toElement = componentMap[to.component];

      const link = new joint.shapes.standard.Link();
      link.source({ id: fromElement.id, port: from.pin });
      link.target({ id: toElement.id, port: to.pin });
      link.attr({
        line: {
          stroke: "#888",
          strokeWidth: 2,
          targetMarker: undefined,
        },
      });

      graph.addCell(link);
    }
  });
}

export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new joint.dia.Graph();

    const paper = new joint.dia.Paper({
      el: containerRef.current,
      model: graph,
      width: 800,
      height: 600,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: "#f0f0f0",
      },
    });

    renderNetlistToGraph(graph, netlist);

    return () => {
      paper.remove();
    };
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <div
        ref={containerRef}
        style={{ border: "1px solid #ccc", width: "800px", height: "600px" }}
      />
    </div>
  );
}
