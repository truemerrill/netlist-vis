import { useEffect, useRef } from "react";
import * as joint from "@joint/core";

import "./editor.css";
import type { Netlist } from "./types.d.ts";
import createCircuitComponent from "./circuit";
import { Wire } from "./circuit/wire";

type Graph = joint.dia.Graph;
type Paper = joint.dia.Paper;

/**
 * Render an entire netlist (components + wires) into a JointJS graph.
 *
 * @param graph - The graph to populate
 * @param netlist - The structured netlist to render
 */
function renderNetlist(graph: Graph, netlist: Netlist): void {
  const componentMap = renderCircuitComponents(graph, netlist);
  renderWires(graph, netlist, componentMap);
}

/**
 * Render all circuit components in the netlist into the graph.
 *
 * @param graph - The graph to populate
 * @param netlist - The structured netlist
 * @returns A map from component name to rendered JointJS element
 */
function renderCircuitComponents(
  graph: Graph,
  netlist: Netlist
): Record<string, joint.dia.Element> {
  const componentMap: Record<string, joint.dia.Element> = {};

  Object.entries(netlist.components).forEach(([name, def], index) => {
    const element = createCircuitComponent(name, def);

    // Randomize the element placement. JointJS actually does have
    // graph placement methods but I haven't had time to figure them
    // out yet.
    element.position(
      100 + (index % 4) * 150,
      100 + Math.floor(index / 4) * 200
    );

    graph.addCell(element);
    componentMap[name] = element;
  });

  return componentMap;
}

/**
 * Render all wires (links) between component pins into the graph.
 *
 * @param graph - The graph to populate
 * @param netlist - The structured netlist
 * @param componentMap - The element lookup for component names
 */
function renderWires(
  graph: Graph,
  netlist: Netlist,
  componentMap: Record<string, joint.dia.Element>
): void {
  Object.entries(netlist.connections).forEach(([name, connections]) => {
    for (let i = 0; i < connections.length - 1; i++) {
      const from = connections[i];
      const to = connections[i + 1];
      const fromElement = componentMap[from.component];
      const toElement = componentMap[to.component];

      const wire = Wire.create(
        name,
        { id: fromElement.id, port: from.pin },
        { id: toElement.id, port: to.pin }
      );

      graph.addCell(wire);
    }
  });
}

export default function EditorWindow({ netlist }: { netlist: Netlist | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !netlist) return;

    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: containerRef.current,
      model: graph,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      gridSize: 10,
      drawGrid: true,
      background: { color: "#f0f0f0" },
    });

    // Monitor the container for resize
    // const resizeObserver = new ResizeObserver((entries) => {
    //   for (let entry of entries) {
    //     if (entry.contentRect) {
    //       paper.setDimensions(
    //         entry.contentRect.width,
    //         entry.contentRect.height
    //       );
    //     }
    //   }
    // });
    // resizeObserver.observe(containerRef.current);

    renderNetlist(graph, netlist);
    return () => {
      resizeObserver.disconnect();
      paper.remove();
    };
  }, [netlist]);

  return (
    <div className="flex-1 relative">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
