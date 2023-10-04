import { ethers } from "ethers"
import { abi, contractAddress } from "../../utils/constants"
import { EtherContext } from "../../utils/context";
import { useContext, useEffect, useState } from "react";

export default function ConnectToContract() {
  const { etherStates, setEtherState } = useContext(EtherContext)
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState();
  const updateEtherStates = { ...etherStates }

  const setConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const { chainId } = await provider.getNetwork()
        const signer = await provider.getSigner()
        setAccount(signer.address)
        if (Number(chainId).toString() == "80001") {
          try {
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const balanceContract = await contract.getBalance(contract.target)
            const listPost = await contract.getPosts()
            updateEtherStates.ether = provider;
            updateEtherStates.contract = contract;
            updateEtherStates.account = signer.address;
            updateEtherStates.listPost = listPost;
            updateEtherStates.balanceContract = balanceContract;
            updateEtherStates.signer=signer
            
            setEtherState(updateEtherStates)
            console.log(updateEtherStates.account)

          } catch (err) {
            console.log(err)
          }
        } else {
          window.alert("The test network is Mumbai")
        }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Install Metamask")
    }
  }


  useEffect(() => {
    const provider = new ethers.JsonRpcProvider('https://endpoints.omniatech.io/v1/matic/mumbai/public')
    const contract = new ethers.Contract(contractAddress, abi, provider)
    contract.getPosts().then(res => {
      setEtherState({ ether: provider, contract: contract, account: null, listPost: res })
    }).catch(error => {
      console.error("Error:", error);
    });

  }, [])

  return (
    <>
      <span onClick={setConnect}>
        {account ? (account.substring(0, 4) + '...' + account.slice(-4)) : 'Connect to wallet'}

      </span>
    </>
  )
}


