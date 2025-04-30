from typing import Annotated, Self
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, EmailStr, model_validator


class User(Document):
    """A user

    Attributes:
        email (EmailStr): the user email. Must be unique
    """

    email: Annotated[EmailStr, Indexed(unique=True)]


class Component(BaseModel):
    """A circuit component

    Note:
        Components are rendered as abstract circuit elements with collections
        of terminals (called pins) on the left and right side of the component.
        The `left_pins` and `right_pins` attributes are tuples that describe
        exactly how the pins should be rendered.  For example, the pins in
        `left_pins` rendered sequentially starting at the top on the left side
        of the component.

    Attributes:
        left_pins (tuple[str, ...]): the left pins.
        right_pins (tuple[str, ...]): the right pins.
    """

    left_pins: tuple[str, ...]
    right_pins: tuple[str, ...]

    @property
    def pins(self) -> tuple[str, ...]:
        """Get all of the pins, regardless of where they are located."""
        return self.left_pins + self.right_pins


class Pin(BaseModel):
    """An `address` of a component pin.

    Attributes:
        component (str): the component name
        pin (str): the pin name
    """

    component: str
    pin: str

    def __hash__(self) -> int:
        return hash((self.component, self.pin))


class Netlist(Document):
    """A netlist (circuit description)

    Attributes:
        user_id (ObjectId): the id of the user who owns the netlist
        components (dict[str, Component]): the components used in the netlist.
            The keys are the component names (for example, "LM741") and the
            values are the left and right pins.
        connections (dict[str, tuple[Pin]]): the connections used in the
            netlist.  The keys are the connection name (for example, "VCC") and
            the values are a tuple of the connected pin addresses.
    """

    user_id: PydanticObjectId
    components: dict[str, Component]
    connections: dict[str, tuple[Pin, ...]]

    @model_validator(mode="after")
    def check_pin_connections(self) -> Self:
        """Check that each of the pins declared in the connections exist

        Raises:
            ValueError: if a connection references an undeclared component
            ValueError: if a connection references an undeclared component pin

        Returns:
            Self: the netlist
        """
        for pins in self.connections.values():
            for pin in pins:
                component = self.components.get(pin.component)
                if component is None:
                    raise ValueError(f'Missing a {pin.component} component')
                if pin.pin not in component.pins:
                    raise ValueError(
                        f'Component {pin.component} does not declare '
                        f'a {pin.pin} pin'
                    )
        return self

    @model_validator(mode="after")
    def check_pin_in_only_one_connection(self) -> Self:
        """Check that every pin is used in at most one connection

        Note:
            If a pin was used in more than one connection (physically a wire),
            this would imply that the wires are connected. Electrically, these
            signals should be treated as a single wire.
            
        Returns:
            Self: the netlist
        """
        pin_assignments: dict[Pin, str] = {}
        for conn, pins in self.connections.items():
            for pin in pins:
                prior_assignment = pin_assignments.get(pin)
                if prior_assignment is not None: 
                    raise ValueError(
                        f"{pin.component}:{pin.pin} is already connected to "
                        f"{prior_assignment}. Cannot connect a pin to more "
                        "than one wire."
                    )
                else:
                    pin_assignments[pin] = conn

        return self


# Models ----------------------------------------------------------------------
#
# Note: Add Beanie models here so they can be initialized later by
#   `.database.init_db()`.
#

MODELS = [User, Netlist]
