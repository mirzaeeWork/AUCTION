import styles from "./AddauctionPage.module.css";
import  { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Form from "../modules/form";
import {EtherContext} from "../../utils/context"
import { ethers } from "ethers";
import { listenForTransactionMine } from "../../utils/KindOfFunction";


export default function AddAuctionPage() {
    const { etherStates, setEtherState } = useContext(EtherContext)
    const updateEtherStates={...etherStates}

    const rout = useRouter()
    const [form, setForm] = useState({
        name: "",
        minBid: "",
        biddingTime: "",
        address1:"",
        address2:""
    })
    const cancleHandler = () => {
        setForm({
            name: "",
            minBid: "",
            biddingTime: "",
            address1:"",
            address2:""
            })
        rout.push("/")
    }
    const saveHandler = async () => {
        if(etherStates.account) {
            try{
                const minBid=ethers.parseEther(form.minBid)
                const name=ethers.encodeBytes32String(form.name)
                etherStates.contract.createPost(name,minBid,form.biddingTime,[form.address1,form.address2]).then(async(res)=>{
                    updateEtherStates.listPost=await etherStates.contract.getPosts()
                    await listenForTransactionMine(res, etherStates.ether)
                    setEtherState(updateEtherStates)
                    rout.push("/")
                }).catch(err=>{window.alert(err)})
    
            }catch(err){
                console.log(err)
                window.alert(err)
            }
        }else{
            window.alert("connect to wallet")
        }

    }
    return (
        <div className={styles.formInputLlist} >
            <h4 style={{marginBottom:10}}>Add New Auction:</h4>
            <Form form={form} setForm={setForm}/>
            <div className={styles.auction_page__buttons}>
                <button className={styles.first} onClick={cancleHandler}>Cancle</button>
                <button className={styles.second} onClick={saveHandler}>Save</button>
            </div>

        </div>
    )

}
