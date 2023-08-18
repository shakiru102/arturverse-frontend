import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { ethers } from 'ethers'
import Arturverse from './artifacts/contracts/Arturverse.sol/Arturvers.json'
import { useState } from 'react';
import TranferModal from './components/TranferModal';

const arturverseAddress = '0xe9a7d426962c3BBeE7E425dE31906725ce5658F7'
const arturverseAddressDev = '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'

function App() {

  const [account, setAccount] = useState(null)
  const [owner, setOwner] = useState(false)
  const [mint, setMint] = useState(false)
  const [transfer, setTransfer] = useState(false)
  const [assets, setAssets] = useState([])
  const [balance, setBalance] = useState(0)
  const [item, setItem] = useState({})

 const requestAccount = async () => {
   return await window.ethereum.request({ method: "eth_requestAccounts" })
 }
if(window.ethereum != undefined) {
  window.ethereum.on('accountsChanged', async () => {
    setAccount(null)
    setOwner(false)
    setBalance(0)
    setAssets([])
  });
}
 const fetchContract = async () => {

   const accounts = await requestAccount()
    setAccount(accounts[0])

    // if(typeof window.etherum !== "undefined") {
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ngABC3wIt249dDdjZIPN9l0z9dydTQal')
        const contract = new ethers.Contract(arturverseAddress, Arturverse.abi, provider)

        try {
            const owner = await contract.owner()
            console.log('owner', owner);
            const user = accounts[0].toLowerCase() == owner.toLowerCase() ? true : false
            setOwner(user)
            const asset = await contract.getAssets(accounts[0])
            const balanceOf = await contract.balanceOf(accounts[0])
            
            const assetValues = Object.values(asset)
            for(let i = 0; i < assetValues.length; i++) {
                const tokenUri = await contract.tokenURI(assetValues[i])
                  const res = await fetch(`https://nftstorage.link/ipfs/${tokenUri.replace('ipfs://','')}`)
                  const data = await res.json()
                  // console.log('response: ', data);
                setAssets(prev => [...prev, {...data, id: assetValues[i].toString()}])
            }
            
            setBalance(balanceOf.toString())
            console.log('balance: ', balanceOf.toString());
            console.log('assets: ', assets);
        } catch (error) {
            console.log('Error: ', error.message)
        }
    // }
 }


  return (
    <div className="h-screen overflow-scroll bg-gray-900">
     <NavBar  open={() => setMint(true)} mint={mint} onClose={() => setMint(false)} fetchContract={fetchContract} account={account} owner={owner}/>
     <div className='mt-28 text-white text-right w-[70%] mx-auto'>asset: {balance}</div>
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
                  }} className='border rounded-lg text-center py-2 cursor-pointer'>TRANSFER</div>
              </div>
            )
          })
        }
      </div>
      { transfer && <TranferModal account={account} onClose={() => {
        setTransfer(false)
        fetchContract()
      }} item={item} />}
    </div>
  );
}

export default App;
