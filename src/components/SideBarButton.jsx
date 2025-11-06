import React from 'react'

function SideBarButton({text,onclick}) {
  return (
    <button className='cursor:pointer border-t-2 border-b-2 p-2 placeholder-opacity-80 hover:opacity-100 hover:shadow-lg hover:bg-white transition-all duration-200' onClick={onclick}>{text}</button>
  )
}

export default SideBarButton