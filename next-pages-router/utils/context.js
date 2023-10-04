import {createContext, useState} from "react";

export const EtherContext=createContext();

const ContextProvider=(props)=>{
    const [etherStates,setEtherState]=useState({ether:null,contract:null,account:null,
        listPost:null,balanceContract:null,signer:null})

    return (
       <EtherContext.Provider value={{etherStates,setEtherState}}>
           {props.children}
       </EtherContext.Provider>
    )
}

export default ContextProvider