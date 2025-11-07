import { useNavigate } from 'react-router'
import Button from '../components/Button' // adjust import path if needed
import React from 'react'

function LogoutButton() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    sessionStorage.clear()
    navigate('/login', { replace: true })
  }

  return (
    <div className="absolute bottom-4 left-4 w-[220px] pr-2">
      <Button text="Logout" onclick={handleLogout} />
    </div>
  )
}

export default LogoutButton
