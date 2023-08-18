import React, { useState } from 'react'
import { ethers } from 'ethers'
import Arturverse from '../artifacts/contracts/Arturverse.sol/Arturvers.json'

const arturverseAddress = process.env.REACT_APP_CONTRACT_ADDRESS
const arturverseAddressDev = '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'

const TranferModal = ({
    onClose,
    account,
    item
}) => {
    const [to, setTo] = useState('')

    const initiateTransfer = async () => {
         try {
            const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_API_KEY}`)
            // Test Environment
            // const signer = await provider.getSigner(account)

            // Production Environment
            const wallet = new ethers.Wallet(process.env.REACT_APP_SECRET_KEY)
            const signer = wallet.connect(provider)
            

            const contract = new ethers.Contract(arturverseAddress, Arturverse.abi, signer)
            const transfer = await contract._transferFrom(account, to, parseInt(item.id))
            // await tokenId.wait()
            console.log(transfer)
            onClose()
         } catch (error) {
            alert(error)
         }
    }

  return (
    <div  className='fixed top-0 left-0 w-full flex justify-center items-center h-screen bg-[#2d2d2d45]'>
      <div className='bg-gray-950 relative z-50 flex flex-col w-[500px] p-8 shadow-lg'>
          <input value={to} onChange={e => setTo(e.target.value)}  placeholder='to' className='mb-3 px-2 bg-transparent border text-white border-gray-700 rounded-lg py-2' />
          <div onClick={initiateTransfer} className='bg-green-700 text-white text-center py-2 mb-3 cursor-pointer rounded-lg'>PROCEED</div>
          <div onClick={onClose} className='bg-red-900 cursor-pointer text-white text-center py-2 rounded-lg'>CANCEL</div>
      </div>
    </div>
  )  
}

export default TranferModal
