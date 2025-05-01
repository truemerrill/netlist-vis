/**
 * Represents the set of pin names assigned to each side of a component.
 * Used to render terminal connections for schematic or layout visualization.
 */
export interface PinAssignments {
  /** Ordered list of pins on the left side of the component. */
  left_pins: string[];

  /** Ordered list of pins on the right side of the component. */
  right_pins: string[];
}

/**
 * A map of component names (e.g. "C1", "U2") to their associated pin assignments.
 * The keys are unique instance names within the netlist.
 */
export type CircuitComponentMap = Record<string, PinAssignments>;
