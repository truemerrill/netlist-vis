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
  def: NetlistComponent,
): CircuitComponent {
  
  // TODO: For now I am just modeling everything in the visual style of an IC,
  //    but in the future we could dispatch based on def.kind and render
  //    different components with different visual styles.
  
  switch (def.kind) {
    default:
      return IC.create(name, {
        left: def.left_pins,
        right: def.right_pins,
      });
  }
}
