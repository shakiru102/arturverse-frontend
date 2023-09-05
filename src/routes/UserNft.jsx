import React, { useContext } from 'react'
import { UserContext } from '../context/Context'
import { Link } from 'react-router-dom'
import TransferModal from '../components/TransferModal'

const UserNft = () => {

    const {
            userassets,
            userbalance, 
            errMessage,
            item, setItem,
            account, 
            transfer, setTransfer,
            requestAccount
      } = useContext(UserContext)
      if(!userassets.length) return <div className='text-white text-center mt-20'>{errMessage}</div>
  return (
    <div>
        <div className='mt-28 text-white text-right w-[70%] mx-auto'>asset: { userbalance }</div>
      <div className='grid grid-cols-3 w-[70%] mx-auto gap-4'>
        {
          userassets.map((item, i ) => {
            return (
              <div className='text-white bg-black p-8' key={i}>
                  <img className='h-[200px] object-cover ' alt={item.name} src={item.image.replace('ipfs://', 'https://nftstorage.link/ipfs/')}/>
                  <div className='font-semibold my-4 text-gray-500'>{item.name}</div>
                  <div className='text-gray-400 text-[14px]'>{item.description}</div>
                  <div className='text-gray-400 text-[14px] my-2 underline'>
                  <Link to={`/nft/${item.id}`} >#{item.id}</Link>
                  </div>
                  <div onClick={() => {
                    setItem(item)
                    setTransfer(true)
                  }} className='border rounded-lg text-center py-2 cursor-pointer'>TRANSFER</div>
              </div>
            )
          })
        }
      </div>
      { transfer && <TransferModal account={account} onClose={() => {
        requestAccount()
        setTransfer(false)
      }} item={item} />}
    </div>
  )
}

export default UserNft
