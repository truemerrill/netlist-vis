from datetime import datetime, timezone
from typing import Generator
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, status
from ..models import Netlist, NetlistRuleViolation
from ..rules import RULES

router = APIRouter()


@router.post(
    "/netlist",
    response_model=Netlist,
    status_code=status.HTTP_201_CREATED
)
async def create_netlist(netlist: Netlist):
    await netlist.insert()
    return netlist


@router.get(
    "/netlist/{id}",
    response_description="A netlist",
    response_model=Netlist
)
async def get_netlist(id: PydanticObjectId):
    # TODO: Only return netlist owned by logged in user
    netlist = await Netlist.get(id)
    if netlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such netlist."
        )
    return netlist


@router.get(
    "/netlist",
    response_model=list[Netlist]
)
async def get_netlists():
    # TODO: Only return netlists owned by logged in user
    netlists = await Netlist.find().to_list()
    return netlists


# Note:
#
#   If the point of this app is to show users a history of their prior
# submissions and DRC violations, we probably don't want to allow a
# netlist to be mutated.  If we did, then we could have stale rule violation
# records that refer to a prior version of the netlist.
#
# Removing the "put" endpoint ...
#


@router.delete(
    "/netlist",
)
async def delete_netlist(id: PydanticObjectId):
    netlist = await Netlist.get(id)
    if netlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such netlist."
        )
    
    # Delete all rule violation records
    async for violation in NetlistRuleViolation.find_all(
        NetlistRuleViolation.netlist_id == netlist.id
    ):
        await violation.delete()
    await netlist.delete()


@router.post(
    "/netlist/{id}/check/{rule}",
    response_description="List of DRC rule check violations",
    response_model=list[NetlistRuleViolation]
)
async def check_netlist_rule(id: PydanticObjectId, rule: str):
    netlist_rule = RULES.get(rule)
    if not netlist_rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No such netlist rule: {rule}"
        )
    
    netlist = await Netlist.get(id)
    if netlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such netlist."
        )

    timestamp = datetime.now(timezone.utc) 
    violations = [
        NetlistRuleViolation(
            netlist_id=id,
            rule=rule,
            timestamp=timestamp,
            detail=violation_detail
        )
        for violation_detail in netlist_rule(netlist)
    ]

    if len(violations) > 0:
        await NetlistRuleViolation.insert_many(violations)
    return violations


@router.post(
    "/netlist/{id}/check",
    response_description="List of DRC rule check violations",
    response_model=list[NetlistRuleViolation]
)
async def check_netlist_rules(id: PydanticObjectId):
    netlist = await Netlist.get(id)
    if netlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such netlist."
        )
    
    def all_rule_violations() -> Generator[NetlistRuleViolation, None, None]:
        timestamp = datetime.now(timezone.utc) 
        for name, netlist_rule in RULES.items():
            for detail in netlist_rule(netlist):
                yield NetlistRuleViolation(
                    netlist_id=id,
                    rule=name,
                    timestamp=timestamp,
                    detail=detail
                )

    violations = list(all_rule_violations())
    if len(violations) > 0:
        await NetlistRuleViolation.insert_many(violations)
    return violations
