import { ethers } from 'ethers'
import React, { createContext, useEffect, useState } from 'react'
import Arturverse from '../artifacts/contracts/Arturverse.sol/Arturvers.json'

export const UserContext = createContext()
const arturverseAddress = process.env.REACT_APP_CONTRACT_ADDRESS

const Context = (props) => {
    const [account, setAccount] = useState(null)
    const [owner, setOwner] = useState(false)
    const [transfer, setTransfer] = useState(false)
    const [assets, setAssets] = useState([])
    const [userassets, setUserAssets] = useState([])
    const [balance, setBalance] = useState(0)
    const [userbalance, setUserBalance] = useState(0)
    const [item, setItem] = useState({})
    const [errMessage, setErrMessage] = useState('Loading...')
    if(window.ethereum !== undefined) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            if(!accounts.length) {
                setAccount(null)
                setUserAssets([])
            }
            setAccount(accounts[0])
           
        });
  
    }

    const requestAccount = async () => {
        try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      
         //  const accounts = await requestAccount()
          if(accounts.length == 0) {
            throw new Error("No account found, ensure you have a metamask wallet installed on your browser.")
          }
          setAccount(accounts[0])
      
          // if(typeof window.etherum !== "undefined") {
            let results = []
              const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ngABC3wIt249dDdjZIPN9l0z9dydTQal')
              const contract = new ethers.Contract(arturverseAddress, Arturverse.abi, provider)
      
              
                  const asset = await contract.getAssets(accounts[0])
                  if(!asset.length) throw new Error('No assets found for account')

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
                  setErrMessage(error.message)
                  setUserAssets([])
              }
          // }
       }

       useEffect(() => {
        requestAccount()
       },[account])

  return (
    <UserContext.Provider value={{
        account,
        setAccount,
        balance,
        setBalance,
        assets,
        setAssets,
        owner, setOwner,
        transfer, setTransfer,
        userassets, setUserAssets,
        userbalance, setUserBalance,
        item, setItem,
        requestAccount,
        errMessage, setErrMessage
    }}>
         { props.children }
    </UserContext.Provider>
  )
}

export default Context
