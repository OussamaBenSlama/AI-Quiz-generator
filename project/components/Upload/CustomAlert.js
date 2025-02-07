import React from 'react'

export default function CustomAlert({message, onClose }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50'>
        <div className='flex flex-col w-[450px] max-w-[90vw] bg-[#e5f4ff] p-6 rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <p>{message}</p>
        <button className='bg-black mt-4 text-white text-2xs md:text-base border-2 border-black rounded-lg px-5 py-2 hover:bg-white hover:border-black hover:text-black flex justify-center items-center' onClick={onClose}>Close</button>
        </div>
    </div>
  )
}
