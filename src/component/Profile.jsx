import React, { useEffect, useState } from 'react'
import Login from './Login'
import Sidebar from './sidebar'
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState([])

  const fetchData = async () => {
    const res = await fetch("http://localhost:3001/users")
    const data = await res.json()
    setProfile(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleLogin() {
    fetchData()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className='p-4 bg-white shadow flex justify-center'>
        <Sidebar />
      </div>      


      <Login addData={handleLogin} />

      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">
   USER PROFILE
      </h2>

      <div className="flex justify-center gap-4">
        {profile.map(user => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition"
          >
            <div className='flex flex-col justify-center gap-2 items-center p-3'>
              <p className="text-lg font-bold text-gray-800  ">
                <User size={50} className='text-green-600 m-4 shadow-lg'/> {user.username}
        
              </p>
               <p className="text-gray-500">{user.email}</p>

              <Link 
                to="/findcharger" 
                className='bg-green-500 p-2 text-white rounded-xl font-bold cursor-pointer hover:bg-green-700 w-50'
              >
                Find Charging Station
              </Link>

            </div>
           

           
          </div>
        ))}
      </div>

    </div>
  )
}

export default Profile