import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='flex flex-col border w-40'>
        <NavLink 
            to="/"
            className={({isActive}) => isActive 
            ? "text-green-500 font-bold"
            : "text-gray-600"
            }
        >
            Home
        </NavLink>
        <NavLink 
            to="/about"
            className={({isActive}) => isActive 
            ? "text-green-500 font-bold"
            : "text-gray-600"
            }
            >About</NavLink>
        <NavLink 
            to="/profile"
            className={({isActive}) => isActive 
            ? "text-green-500 font-bold"
            : "text-gray-600"
            }
        >Profile</NavLink>
    </div>
  )
}

export default Sidebar