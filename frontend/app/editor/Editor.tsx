import { useEffect, useRef, useState } from "react";
import * as joint from "@joint/core";
import { IC } from "./circuit/ic";
import './editor.css';


/** Type for displaying a tooltip on the editor page */
export interface EditorTooltip {
  text: string;
  x: number;
  y: number;
}


export default function Editor() {
  const [tooltip, setTooltip] = useState<EditorTooltip | null>(null);
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

    // Add a sample rectangle (just to confirm it renders)
    const ic = IC.create("U2", {
      left: ["p1", "p3", "p5", "p7"],
      right: ["p2", "p4"],
    });

    ic.position(100, 100);
    graph.addCell(ic);

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
