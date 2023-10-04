import styles from "./AddauctionPage.module.css";
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { EtherContext } from "../../utils/context"
import { listenForTransactionMine } from "../../utils/KindOfFunction";
import FormShow from "../modules/formShow";
import { ethers } from "ethers";

export default function ShowAllBid({id}) {
  const { etherStates, setEtherState } = useContext(EtherContext)
  const [allBid, setAllBid] = useState()
  const rout = useRouter()

  const getShowAllBid = () => {
    if (etherStates.contract) {
      etherStates.contract.getAllBidsOfPost(Number(id)).then(res => {
        setAllBid(res)
      }).catch(err=>{window.alert(err)})
    }
  }

  useEffect(() => {
    getShowAllBid()
  }, [])


  const cancleHandler = () => {
      rout.push("/")
  }

  return (
      <div className={styles.formInputLlist} >
          <h4 style={{ marginBottom: 10 }}>A list of offers for this auction:</h4>
          {allBid ?
                allBid.map((bid, index) => <FormShow key={index + 1}
                    nameAmount="Amount : " nameBuyer="Buyer : "
                    labelAmount={ethers.formatEther(bid.amount)}
                    labelBuyer={bid.buyer.substring(0, 4) + '...' + bid.buyer.slice(-4)}
                    nameWithdrawMoney="Withdraw money : "
                    labelWithdrawMoney={(bid.isFinished).toString()} />)
                : null}
          <div className={styles.auction_page__buttons}>
              <button className={styles.first} onClick={cancleHandler}>Back</button>
          </div>

      </div>

  )
}
