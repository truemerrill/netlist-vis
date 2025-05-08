import requests
from typing import Any, TypedDict, cast


API_BASE_URL = "http://localhost:8000"
TEST_USER_EMAIL = "test@example.com"


EXAMPLE_NETLISTS: list[dict[str, Any]] = [
    {
        "name": "butterworth",
        "components": {
            "R1": {"kind": "resistor", "left_pins": ["in"], "right_pins": ["n1"]},
            "R2": {"kind": "resistor", "left_pins": ["n1"], "right_pins": ["n2"]},
            "C1": {"kind": "capacitor", "left_pins": ["n1"], "right_pins": ["gnd"]},
            "C2": {"kind": "capacitor", "left_pins": ["n2"], "right_pins": ["out"]},
            "U1": {
                "kind": "opamp",
                "left_pins": ["vcc", "in-"],
                "right_pins": ["gnd", "out"],
            },
            "V1": {"kind": "vsource", "left_pins": ["gnd"], "right_pins": ["vcc"]},
        },
        "connections": {
            "IN": [{"component": "R1", "pin": "in"}],
            "VCC": [
                {"component": "V1", "pin": "vcc"},
                {"component": "U1", "pin": "vcc"},
            ],
            "N1": [
                {"component": "R1", "pin": "n1"},
                {"component": "R2", "pin": "n1"},
                {"component": "C1", "pin": "n1"},
            ],
            "N2": [
                {"component": "R2", "pin": "n2"},
                {"component": "C2", "pin": "n2"},
                {"component": "U1", "pin": "in-"},
            ],
            "OUT": [
                {"component": "C2", "pin": "out"},
                {"component": "U1", "pin": "out"},
            ],
            "GND": [
                {"component": "V1", "pin": "gnd"},
                {"component": "C1", "pin": "gnd"},
                {"component": "U1", "pin": "gnd"},
            ],
        },
    },
    {
        "name": "bad-butterworth",
        "components": {
            "R0": {"kind": "resistor", "left_pins": ["n1"], "right_pins": ["n2"]},
            "R1": {"kind": "resistor", "left_pins": ["in"], "right_pins": ["n1"]},
            "R2": {"kind": "resistor", "left_pins": ["n1"], "right_pins": ["n2"]},
            "C1": {"kind": "capacitor", "left_pins": ["n1"], "right_pins": ["gnd"]},
            "C2": {"kind": "capacitor", "left_pins": ["n2"], "right_pins": ["out"]},
            "U1": {
                "kind": "opamp",
                "left_pins": ["vcc", "in-"],
                "right_pins": ["gnd", "out"],
            },
            "V1": {"kind": "vsource", "left_pins": ["gnd"], "right_pins": ["vcc"]},
        },
        "connections": {
            "IN": [{"component": "R1", "pin": "in"}],
            "VOLTAGE": [
                {"component": "V1", "pin": "vcc"},
                {"component": "U1", "pin": "vcc"},
            ],
            "N1": [
                {"component": "R1", "pin": "n1"},
                {"component": "R2", "pin": "n1"},
                {"component": "C1", "pin": "n1"},
            ],
            "N2": [
                {"component": "R2", "pin": "n2"},
                {"component": "C2", "pin": "n2"},
                {"component": "U1", "pin": "in-"},
            ],
            "OUT": [
                {"component": "C2", "pin": "out"},
                {"component": "U1", "pin": "out"},
            ],
            "GROUND": [
                {"component": "V1", "pin": "gnd"},
                {"component": "C1", "pin": "gnd"},
                {"component": "U1", "pin": "gnd"},
            ],
        },
    }
]


class User(TypedDict):
    _id: str
    email: str


def create_user(email: str) -> User:
    r = requests.post(
        f"{API_BASE_URL}/users/",
        params={"email": email},
        headers={"accept": "application/json"},
    )
    r.raise_for_status()
    user = cast(User, r.json())
    return user


def get_user(email: str) -> User:
    r = requests.get(
        f"{API_BASE_URL}/users/{email}", headers={"accept": "application/json"}
    )
    r.raise_for_status()
    user = cast(User, r.json())
    return user


def create_netlist(user: User, netlist: dict[str, Any]) -> dict[str, Any]:
    payload = {**netlist}
    payload["user_id"] = user["_id"]

    r = requests.post(
        f"{API_BASE_URL}/netlist",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
        },
        json=payload,
    )
    r.raise_for_status()
    return r.json()


def main():
    try:
        user = create_user(TEST_USER_EMAIL)
    except Exception:
        user = get_user(TEST_USER_EMAIL)
    for netlist in EXAMPLE_NETLISTS:
        create_netlist(user, netlist)


if __name__ == "__main__":
    main()
