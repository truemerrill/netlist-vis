import { useEffect, useRef } from "react";
import { dia, shapes } from "@joint/core";
import { DirectedGraph } from "@joint/layout-directed-graph";

import "./editor.css";
import type { Netlist } from "./types.d.ts";
import createCircuitComponent from "./circuit";
import { Wire } from "./circuit/wire";
import type { CircuitComponent } from "./circuit/component";


/**
 * Make all of the netlist cells (components + wires).
 *
 * @param netlist - The structured netlist to render
 */
function makeCells(netlist: Netlist): dia.Cell[] {
  const [ components, componentMap ] = makeComponents(netlist);
  const wires = makeWires(netlist, componentMap);
  return [...components, ...wires];
}

/**
 * Render all circuit components in the netlist into the graph.
 *
 * @param netlist - The structured netlist
 * @returns A map from component name to rendered JointJS element
 */
function makeComponents(
  netlist: Netlist
): [CircuitComponent[], Record<string, CircuitComponent>] {
  const componentMap: Record<string, CircuitComponent> = {};

  Object.entries(netlist.components).forEach(([name, def], index) => {
    const element = createCircuitComponent(name, def);
    componentMap[name] = element;
  });
  return [Object.values(componentMap), componentMap];
}

/**
 * Render all wires (links) between component pins into the graph.
 *
 * @param graph - The graph to populate
 * @param netlist - The structured netlist
 * @param componentMap - The element lookup for component names
 */
function makeWires(
  netlist: Netlist,
  componentMap: Record<string, dia.Element>
): Wire[] {
  const wires: Wire[] = [];

  Object.entries(netlist.connections).forEach(([name, connections]) => {
    for (let i = 0; i < connections.length - 1; i++) {
      const from = connections[i];
      const to = connections[i + 1];
      const fromElement = componentMap[from.component];
      const toElement = componentMap[to.component];

      wires.push(Wire.create(
        name,
        { id: fromElement.id, port: from.pin },
        { id: toElement.id, port: to.pin }
      ));
    }
  });
  return wires;
}

export default function EditorWindow({ netlist }: { netlist: Netlist | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !netlist) return;

    const graph = new dia.Graph();
    const paper = new dia.Paper({
      el: containerRef.current,
      model: graph,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      gridSize: 10,
      drawGrid: true,
      background: { color: "#f0f0f0" },
    });

    const cells = makeCells(netlist);
    graph.addCells(cells);
    graph.resetCells(cells);

    DirectedGraph.layout(graph, {});
    
    // renderNetlist(graph, netlist);
    return () => {
      paper.remove();
    };
  }, [netlist]);

  return (
    <div className="flex-1 relative">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
