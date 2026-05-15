import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='flex gap-5 font-semibold text-lg'>
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
            to="/findcharger"
            className={({isActive}) => isActive 
            ? "text-green-500 font-bold"
            : "text-gray-600"
            }
        >
            Find Chargers
        </NavLink>
        <NavLink 
            to="/about"
            className={({isActive}) => isActive 
            ? "text-green-500 font-bold"
            : "text-gray-600"
            }
        >About Us</NavLink>
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