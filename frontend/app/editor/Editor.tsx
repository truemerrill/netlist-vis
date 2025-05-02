import { useEffect, useState } from "react";
import EditorWindow from "./EditorWindow";
import type { Netlist } from "./types.d.ts";


// Test data - replace with API call
import data from "./butterworth.json";
const netlist: Netlist = data;


export default function Editor() {
  const [selected, setSelected] = useState<Netlist | null>(null);

  useEffect(() => {
    setSelected(netlist);
  }, []);

  return (
    <div className="flex h-full">
      <EditorWindow netlist={selected ?? undefined} />
    </div>
  )
}