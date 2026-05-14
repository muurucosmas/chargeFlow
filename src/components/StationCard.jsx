import React from 'react'

export default function StationCard({station,onClick}) {
  return (
    <div onClick={onClick} className="flex">
      <h3 className="font-extrabold">{station.name}</h3>
   <p className=" font-bold ">{station.location}</p>
  <p className="">{station.type}</p>
   <p className="">{station.price}</p>
    </div>
  )
}
