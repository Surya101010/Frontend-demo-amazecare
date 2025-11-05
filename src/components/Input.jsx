import React from 'react'

function Input({type,reference,placeholder}) {
  return (
    <div >
        <input type={type}   ref={reference} placeholder={placeholder} className='m-4 rounded-lg border-4 border-blue-500 text-black p-2 '></input>
    </div>
    
  )
}

export default Input