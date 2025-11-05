import React from 'react'

export default function Button({text,type,onclick}) {
  return (
    <div className='flex justify-center items-center' ><button type={type} onClick={onclick} className='px-4 py-2 bg-white border border-gray-300 rounded-xl text-base font-semibold shadow-sm hover:bg-gray-200 active:scale-95 transition-transform duration-150 cursor-pointer flex justify-center items-center w-40'>
        {text}
        </button></div>
  )
}
