from typing import Generator, Protocol
from .models import Netlist


class NetlistRule(Protocol):
    """Protocol for a generator over netlist rule violations"""
    
    def __call__(self, netlist: Netlist) -> Generator[str, None, None]:
        """Iterate over all rule violation issues.
        
        Yields:
            str: message reporting the rule violation
        """
        ...


def all_components_used(netlist: Netlist) -> Generator[str, None, None]:
    """Check that all netlist components are used at least once

    Args:
        netlist (Netlist): the netlist

    Yields:
        str: a message reporting each unused component
    """
    def connected_components() -> Generator[str, None, None]:
        for pins in netlist.connections.values():
            for pin in pins:
                yield pin.component
    
    used_component_names = set(connected_components())
    for component_name in netlist.components.keys():
        if component_name not in used_component_names:
            msg = f"Unused component: {component_name}. Remove it from the netlist."
            yield msg


def has_ground(netlist: Netlist) -> Generator[str, None, None]:
    if "GND" not in netlist.connections.keys():
        yield "Missing a GND connection."


def has_vcc(netlist: Netlist) -> Generator[str, None, None]:
    if "VCC" not in netlist.connections.keys():
        yield "Missing a VCC connection."


# Note: This is a global dict containing all of the registered NetlistRule
#   generators. The keys are the rule names.  The values are the generators.

RULES: dict[str, NetlistRule] = {
    "ALL_COMPONENTS_USED": all_components_used,
    "HAS_GROUND": has_ground,
    "HAS_VCC": has_vcc
}
