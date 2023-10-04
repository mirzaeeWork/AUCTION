import styles from "./AddauctionPage.module.css";
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { EtherContext } from "../../utils/context"
import { listenForTransactionMine } from "../../utils/KindOfFunction";
import FormShow from "../modules/formShow";
import { ethers } from "ethers";

export default function CancleBid({ id }) {
    const { etherStates, setEtherState } = useContext(EtherContext)
    const updateEtherStates = { ...etherStates }
    const [data, setData] = useState()
    const [show, setShow] = useState()
    const rout = useRouter()

    const cancleHandler = () => {
        rout.push("/")
    }
    const WithdrawHandler = async () => {
        if (etherStates.account) {
            try {
                let dataHash = ethers.encodeBytes32String(data)
                console.log(dataHash)
                let hash = await etherStates.contract.getPostHash(Number(id),dataHash,{from:etherStates.account})
                const _hash = ethers.getBytes(hash)
                const signature = await etherStates.signer.signMessage(_hash);
                etherStates.contract.withdraw(Number(id),dataHash,signature).then(async (res) => {
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
    const BidsOfOneAddress = async () => {
        if (etherStates.account) {
            try {
                etherStates.contract.getPostBidsOfOneAddress(Number(id), { from: etherStates.account }).then((res) => {
                    setShow(res)
                }).catch(err => { window.alert(err) })
            } catch (err) {
                console.log(err)
                window.alert(err)
            }
        } else {
            window.alert("connect to wallet")
        }
    }

    useEffect(() => {
        BidsOfOneAddress()
    }, [etherStates.account])


    return (
        <div className={styles.formInputLlist} >
            <h4 style={{ marginBottom: 10 }}>Other than the last bid for the auction, other bids can be withdrawn:</h4>
            {show ?
                show.map((bid, index) => <FormShow key={index + 1}
                    nameAmount="Amount : " nameBuyer="Buyer : "
                    labelAmount={ethers.formatEther(bid.amount)}
                    labelBuyer={bid.buyer.substring(0, 4) + '...' + bid.buyer.slice(-4)}
                    nameWithdrawMoney="Withdraw money : "
                    labelWithdrawMoney={(bid.isFinished).toString()} />)
                : null}

            <div style={{ marginTop: 20 }}>
                <label htmlFor={data}>Enter a text for transaction security:</label>
                <input type="text" name={data} value={data} onChange={(e)=>setData(e.target.value)} />
            </div>
            <div className={styles.auction_page__buttons}>
                <button className={styles.first} onClick={cancleHandler}>Cancle</button>
                <button className={styles.second} onClick={WithdrawHandler}>Withdraw</button>
            </div>

        </div>

    )
}
