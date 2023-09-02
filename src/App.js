import './App.css';
import NavBar from './components/NavBar';
import { ethers } from 'ethers'
import Arturverse from './artifacts/contracts/Arturverse.sol/Arturvers.json'
import { useCallback, useEffect, useState } from 'react';
import RedeemModal from './components/RedeemModal';

const arturverseAddress = process.env.REACT_APP_CONTRACT_ADDRESS

function App() {

  const [account, setAccount] = useState(null)
  const [owner, setOwner] = useState(false)
  const [mint, setMint] = useState(false)
  const [transfer, setTransfer] = useState(false)
  const [assets, setAssets] = useState([])
  const [userassets, setUserAssets] = useState([])
  const [balance, setBalance] = useState(0)
  const [userbalance, setUserBalance] = useState(0)
  const [item, setItem] = useState({})

 const requestAccount = async () => {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

   //  const accounts = await requestAccount()
    setAccount(accounts[0])

    // if(typeof window.etherum !== "undefined") {
      let results = []
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ngABC3wIt249dDdjZIPN9l0z9dydTQal')
        const contract = new ethers.Contract(arturverseAddress, Arturverse.abi, provider)

        try {
            const owner = await contract.owner()
            console.log('owner', owner);
            // const user = accounts[0].toLowerCase() == owner.toLowerCase() ? true : false
            // setOwner(user)
            const asset = await contract.getAssets(accounts[0])
            const balanceOf = await contract.balanceOf(accounts[0])
            
            const assetValues = Object.values(asset)
            for(let i = 0; i < assetValues.length; i++) {
                const tokenUri = await contract.tokenURI(assetValues[i])
                  const res = await fetch(`https://nftstorage.link/ipfs/${tokenUri.replace('ipfs://','')}`)
                  const data = await res.json()
                  // console.log('response: ', data);
                results = [...results, {...data, id: assetValues[i].toString()}]
            }
            setUserAssets(results)
            setUserBalance(balanceOf.toString())
            setOwner(true)
        } catch (error) {
            console.log('Error: ', error.message)
        }
    // }
 }
if(window.ethereum !== undefined) {
  window.ethereum.on('accountsChanged', async () => {
    setAccount(null)
    setOwner(false)
    setBalance(0)
    setAssets([])
  });
  
}
 const fetchContract = useCallback(async () => {

  //  const accounts = await requestAccount()
  //   setAccount(accounts[0])

    // if(typeof window.etherum !== "undefined") {
      let results = []
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ngABC3wIt249dDdjZIPN9l0z9dydTQal')
        const contract = new ethers.Contract(arturverseAddress, Arturverse.abi, provider)

        try {
            const owner = await contract.owner()
            console.log('owner', owner);
            // const user = accounts[0].toLowerCase() == owner.toLowerCase() ? true : false
            // setOwner(user)
            const asset = await contract.getAssets(arturverseAddress)
            const balanceOf = await contract.balanceOf(arturverseAddress)
            
            const assetValues = Object.values(asset)
            for(let i = 0; i < assetValues.length; i++) {
                const tokenUri = await contract.tokenURI(assetValues[i])
                  const res = await fetch(`https://nftstorage.link/ipfs/${tokenUri.replace('ipfs://','')}`)
                  const data = await res.json()
                  // console.log('response: ', data);
                results = [...results, {...data, id: assetValues[i].toString()}]
            }
            setAssets(results)
            setBalance(balanceOf.toString())
            console.log('balance: ', balanceOf.toString());
            console.log('assets: ', assets);
        } catch (error) {
            console.log('Error: ', error.message)
        }
    // }
 },[assets])
useEffect(() => {
fetchContract()
},[])



  return (
    <div className="h-screen overflow-scroll bg-gray-900">
     <NavBar  open={() => setOwner(prev => !prev)} mint={mint} onClose={() => setMint(false)} fetchContract={requestAccount} account={account} owner={owner}/>
     <div className='mt-28 text-white text-right w-[70%] mx-auto'>asset: { owner ? userbalance : balance }</div>
      {
        owner ?
        <div className='grid grid-cols-3 w-[70%] mx-auto gap-4'>
        {
          userassets.map((item, i ) => {
            return (
              <div className='text-white bg-black p-8' key={i}>
                  <img className='h-[200px] object-cover ' alt={item.name} src={item.image.replace('ipfs://', 'https://nftstorage.link/ipfs/')}/>
                  <div className='font-semibold my-4 text-gray-500'>{item.name}</div>
                  <div className='text-gray-400 text-[14px]'>{item.description}</div>
                  <div className='text-gray-400 text-[14px] my-2'>#{item.id}</div>
                  {/* <div onClick={() => {
                    setItem(item)
                    setTransfer(true)
                  }} className='border rounded-lg text-center py-2 cursor-pointer'>REDEEM</div> */}
              </div>
            )
          })
        }
      </div>
        : 
        <div className='grid grid-cols-3 w-[70%] mx-auto gap-4'>
        {
          assets.map((item, i ) => {
            return (
              <div className='text-white bg-black p-8' key={i}>
                  <img className='h-[200px] object-cover ' alt={item.name} src={item.image.replace('ipfs://', 'https://nftstorage.link/ipfs/')}/>
                  <div className='font-semibold my-4 text-gray-500'>{item.name}</div>
                  <div className='text-gray-400 text-[14px]'>{item.description}</div>
                  <div className='text-gray-400 text-[14px] my-2'>#{item.id}</div>
                  <div onClick={() => {
                    setItem(item)
                    setTransfer(true)
                  }} className='border rounded-lg text-center py-2 cursor-pointer'>REDEEM</div>
              </div>
            )
          })
        }
      </div>
      }
      { transfer && <RedeemModal account={account} onClose={() => {
        setTransfer(false)
        fetchContract()
      }} item={item} />}
    </div>
  );
}

export default App;
