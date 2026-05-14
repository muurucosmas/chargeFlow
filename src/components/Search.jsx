import React from 'react'

function Search({search,setSearch}) {
  return (
    <div>
     
      <input type="text" value={search} placeholder='search location here' onChange={(e) =>setSearch(e.target.value)}/>
    </div>
  )
}

export default Search