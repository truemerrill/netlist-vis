from beanie import PydanticObjectId
from beanie.exceptions import DocumentNotFound
from fastapi import APIRouter, HTTPException, status
from ..models import Netlist

router = APIRouter()


@router.post(
    "/netlist",
    response_description="Add a new netlist",
    response_model=Netlist,
    status_code=status.HTTP_201_CREATED
)
async def create_netlist(netlist: Netlist):
    await netlist.insert()
    return netlist


@router.get(
    "/netlist/{id}",
    response_description="Get a netlist",
    response_model=Netlist
)
async def get_netlist(id: PydanticObjectId):
    netlist = await Netlist.get(id)
    if netlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such netlist."
        )
    return netlist


@router.put(
    "/netlist",
    response_description="Update a netlist",
    response_model=Netlist
)
async def update_netlist(netlist: Netlist):
    try:
        await netlist.replace()
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Value error, {str(e)}"
        )
    except DocumentNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Missing netlist."
        )
    return netlist


@router.delete(
    "/netlist",
    response_description="Delete a netlist"
)
async def delete_netlist(id: PydanticObjectId):
    netlist = await Netlist.get(id)
    if netlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No such netlist."
        )
    await netlist.delete()
