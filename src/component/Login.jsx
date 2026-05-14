import React, { useState } from 'react'

function Login({ addData }) {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    email: ""
  })

  function handleChange(e) {
    const { name, value } = e.target
    setLoginForm({
      ...loginForm,
      [name]: value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      })

      addData() // refresh list

      setLoginForm({
        username: "",
        password: "",
        email: ""
      })

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4"
      >

        <h2 className="text-2xl font-bold text-center">
          Create User
        </h2>

        <input
          type="text"
          name="username"
          value={loginForm.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="password"
          name="password"
          value={loginForm.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="email"
          name="email"
          value={loginForm.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>

      </form>

    </div>
  )
}

export default Login