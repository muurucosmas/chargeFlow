import React, { useEffect, useState } from 'react'
import Login from './Login'
import Sidebar from './sidebar'

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

      <div className="flex justify-">
        {profile.map(user => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition"
          >
            <p className="text-lg font-bold text-gray-800">
              Hello {user.username}
            </p>

            <p className="text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Profile