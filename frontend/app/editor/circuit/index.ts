import type { NetlistComponent } from "../types";
import { CircuitComponent } from "./component";
import { IC } from "./ic";


/**
 * Factory function that creates a CircuitComponent based on its kind.
 *
 * @param name - The component ID (e.g. "U1", "C2")
 * @param def - The component definition from the netlist
 * @returns A new CircuitComponent positioned at (0, 0)
 */
export default function createCircuitComponent(
  name: string,
  def: NetlistComponent
): CircuitComponent {
  switch (def.kind) {
    case "ic":
      return IC.create(name, {
        left: def.left_pins,
        right: def.right_pins,
      });
    default:
      throw new Error(`Unsupported component kind: ${def.kind}`);
  }
}
