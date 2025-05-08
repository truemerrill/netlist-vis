/**
 * Represents a full netlist, including component definitions and signal connections.
 */
export interface Netlist {
  _id: string | undefined;

  /**
   * The user who owns or created the netlist.
   */
  user_id: string;

  /**
   * The name of the netlist
   */
  name: string;

  /**
   * A mapping of component IDs (e.g., "C1", "U1") to their definitions.
   */
  components: Record<string, NetlistComponent>;

  /**
   * A mapping of signal names (e.g., "GND", "VCC") to the set of connections associated with that signal.
   */
  connections: Record<string, Connection[]>;
}

/**
 * The kind or type of component (e.g., "ic", "resistor", "capacitor").
 * Currently only "ic" is supported.
 */
export type ComponentType = "ic";

/**
 * Describes a single circuit component such as an integrated circuit (IC).
 */
export interface NetlistComponent {
  kind: string;

  /**
   * A list of pin names on the left side of the component (typically inputs).
   */
  left_pins: string[];

  /**
   * A list of pin names on the right side of the component (typically outputs).
   */
  right_pins: string[];
}

/**
 * Represents a single connection to a specific pin on a component.
 */
export interface Connection {
  /**
   * The component ID to which this pin belongs.
   */
  component: string;

  /**
   * The name of the pin on the component that participates in this connection.
   */
  pin: string;
}


export interface NetlistRuleViolation {
  _id: string | undefined;
 
  /**
   * The netlist ID
   */
  netlist_id: string;

  /**
   * The rule name
   */
  rule: string;

  /**
   * The timestamp when the rule was last checked
   */
  timestamp: string;

  /**
   * Detail about the rule violation
   */
  detail: string;
}