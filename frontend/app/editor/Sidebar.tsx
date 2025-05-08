import type { Netlist } from "./types";

type SidebarProps = {
  netlists: Netlist[];
  choice: Netlist | null;
  onSelect: (netlist: Netlist) => void;
};

export function Sidebar({ netlists, choice, onSelect }: SidebarProps) {
  function cssClass(netlist: Netlist): string {
    if (netlist._id === choice?._id) {
      return "selected sidebar-item";
    } else {
      return "sidebar-item";
    }
  }

  return (
    <div className="sidebar">
      <h4>Netlists</h4>
      <div className="sidebar-selector">
        <ul>
          {netlists.map((netlist) => (
            <li>
              <div
                key={netlist._id}
                className={cssClass(netlist)}
                onClick={() => onSelect(netlist)}
              >
                <span>{netlist.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
