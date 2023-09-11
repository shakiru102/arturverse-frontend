import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Arturverse from '../artifacts/contracts/Arturverse.sol/Arturvers.json'
import { useParams } from 'react-router-dom'
const arturverseAddress = process.env.REACT_APP_CONTRACT_ADDRESS
const Nft = () => {

  const [nft, setNft] = useState(null)
  const { nftId } = useParams()
  const [errMessage, setErrMessage] = useState('Loading...')
  const retreiveCertificate = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ngABC3wIt249dDdjZIPN9l0z9dydTQal')
    const contract = new ethers.Contract(arturverseAddress, Arturverse.abi, provider)
    const tokenUri = await contract.tokenURI(nftId)
    const res = await fetch(`https://nftstorage.link/ipfs/${tokenUri.replace('ipfs://','')}`)
    const data = await res.json()
    setNft(data)
    } catch (error) {
      setErrMessage('Asset not found')
    }
  }


  useEffect(() => {
   retreiveCertificate()
  },[])

  if(!nft) return <div className='text-white text-center mt-20'>{errMessage}.</div>

  return (
    <div className='flex flex-col md:flex-row mx-auto my-28 gap-11 text-white p-10'>
        <div className='flex-1'>
        <img src={nft.image.replace('ipfs://', 'https://nftstorage.link/ipfs/')} alt={nft.name} />
        </div>
        <div className='flex-1 p-4 flex flex-col '>
          <h1 className='text-[28px]'>#{nftId}</h1>
          <p className='text-[20px] '>{nft.name}</p>
          <p>{nft.description}</p>
          {
            nft.attributes && nft.attributes.map((item, i) => (
              <p key={i}>{item.value}</p>
            ))
          }
        </div>
    </div>
  )
}

export default Nft
