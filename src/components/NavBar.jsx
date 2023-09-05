import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/Context'
// import MintModal from './MintModal'



const NavBar = ({
   
}) => {

  const {
        account,
        owner, setOwner,
        requestAccount
  } = useContext(UserContext)

  

  return (
    <div className='text-white h-[50px] fixed top-0 w-full z-0 bg-blue-950 flex items-center justify-between px-10'>
      <div className='text-[24px]' >Arturverse</div>
     { account != null ? 
     <div className='flex items-center gap-3'>
        <div className='underline'>{account.substring(0, 8)}</div> 
        
      <span onClick={() => {
          window.location.href = '/'
      }} className='border cursor-pointer border-white rounded-md px-6 py-1'>
       {"Market Place" }
    </span> 
     <span onClick={() => {
          window.location.href = '/nft'
    }} className='border cursor-pointer border-white rounded-md px-6 py-1'>
     { "My NFT" }
  </span>
     
     </div>: 
     <span onClick={requestAccount} className='border cursor-pointer border-white rounded-md px-6 py-1'>
        connect
     </span>
     }
    </div>
  )
}

export default NavBar
