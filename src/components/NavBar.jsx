import React from 'react'
import MintModal from './MintModal'
// import MintModal from './MintModal'



const NavBar = ({
    fetchContract,
    account,
    owner,
    mint,
    onClose,
    open
}) => {





  return (
    <div className='text-white h-[50px] fixed top-0 w-full z-0 bg-blue-950 flex items-center justify-between px-10'>
      <div className='text-[24px]' >Arturverse</div>
     { account != null ? 
     <div className='flex items-center gap-3'>
      
        <div className='underline'>{account.substring(0, 8)}</div> 
        
      <span onClick={open} className='border cursor-pointer border-white rounded-md px-6 py-1'>
       { !owner ? "My NFT" : "Market Place" }
    </span>
     </div>: 
     <span onClick={fetchContract} className='border cursor-pointer border-white rounded-md px-6 py-1'>
        connect
     </span>
     }
   {  mint && <MintModal account={account} onClose={onClose}  /> }
    </div>
  )
}

export default NavBar
