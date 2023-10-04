import styles from "./AddauctionPage.module.css";
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { EtherContext } from "../../utils/context"
import { listenForTransactionMine } from "../../utils/KindOfFunction";
import { ethers } from "ethers";

export default function ConfirmAuction({ id }) {
    const { etherStates, setEtherState } = useContext(EtherContext)
    const updateEtherStates = { ...etherStates }
    const [data, setData] = useState()
    const rout = useRouter()

    const cancleHandler = () => {
        rout.push("/")
    }
    const ConfirmHandler = async () => {
        if (etherStates.account) {
            try {
                let dataHash = ethers.encodeBytes32String(data)
                console.log(dataHash)
                let hash = await etherStates.contract.getPostHash(Number(id),dataHash,{from:etherStates.account})
                const _hash = ethers.getBytes(hash)
                const signature = await etherStates.signer.signMessage(_hash);
                etherStates.contract.confirmPost(Number(id),dataHash,signature).then(async (res) => {
                    await listenForTransactionMine(res, etherStates.ether)
                    window.alert("Success transaction!")
                    rout.push("/")
                }).catch(err=>{window.alert(err)})
            } catch (err) {
                console.log(err)
                window.alert(err)
            }
        } else {
            window.alert("connect to wallet")
        }
    }


    return (
        <div className={styles.formInputLlist} >
            <h4 style={{ marginBottom: 10 }}>Confirm the auction: </h4>
            <div style={{ marginTop: 20 }}>
                <label htmlFor={data}>Enter a text for transaction security:</label>
                <input type="text" name={data} value={data} onChange={(e)=>setData(e.target.value)} />
            </div>
            <div className={styles.auction_page__buttons}>
                <button className={styles.first} onClick={cancleHandler}>Cancle</button>
                <button className={styles.second} onClick={ConfirmHandler}>Confirm</button>
            </div>

        </div>

    )
}
