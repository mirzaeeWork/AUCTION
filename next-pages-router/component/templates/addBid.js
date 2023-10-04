import styles from "./AddauctionPage.module.css";
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { EtherContext } from "../../utils/context"
import { ethers } from "ethers";
import { listenForTransactionMine } from "../../utils/KindOfFunction";
import FormInput from "../modules/formInput";

export default function AddBid({ id }) {
    const { etherStates, setEtherState } = useContext(EtherContext)
    const [eth, setEth] = useState()
    const rout = useRouter()

    const cancleHandler = () => {
        setEth()
        rout.push("/")
    }
    const saveHandler = async () => {
        if (etherStates.account) {
            try {
                etherStates.contract.createBid(Number(id), { value: ethers.parseEther(eth) }).then(async (res) => {
                    await listenForTransactionMine(res, etherStates.ether)
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
            <h4 style={{ marginBottom: 10 }}>Add New Bid for Auction:</h4>
            <FormInput
                name="eth"
                label="The amount of Ether to bid:"
                type="text"
                value={eth}
                onChange={(e) => setEth(e.target.value)}
            />
            <div className={styles.auction_page__buttons}>
                <button className={styles.first} onClick={cancleHandler}>Cancle</button>
                <button className={styles.second} onClick={saveHandler}>Save</button>
            </div>

        </div>

    )
}
