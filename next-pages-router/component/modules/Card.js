import Link from "next/link";
import styles from "./Card.module.css";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { EtherContext } from "../../utils/context";


function Card({ post }) {
  const { id, minBid, time, biddingEndTime, highestBid, seller,
    highestBidder, ended, name, confirmPost1, confirmPost2 } = post;

  const { etherStates, setEtherState } = useContext(EtherContext)
  const now = new Date().getTime();
  const timer = (Number(biddingEndTime) * 1000) - Number(now)
  const [seconds, setSeconds] = useState((Number(biddingEndTime) * 1000) - Number(now))
  const [secondtime, setSecondTime] = useState()
  const [bid, setBid] = useState()
  const [confirm, setConfirm] = useState([{approve:"",adr:""}])


  function displayCount(time) {
    // Calculate current hours, minutes, and seconds
    const startTime = Math.floor(timer / 1000)
    let day = Math.floor(startTime / 86400);
    let hours = Math.floor((startTime % 86400) / 3600);
    let minutes = Math.floor((startTime % 3600) / 60);
    let seconds = Math.floor(startTime % 60)
    // Display a leading zero if the values are less than ten
    let displayDay = (day < 100 ? day : day);
    let displayHours = (hours < 10) ? '0' + hours : hours;
    let displayMinutes = (minutes < 10) ? '0' + minutes : minutes;
    let displaySeconds = (seconds < 10) ? '0' + seconds : seconds;
    let formatTime
    if (displayDay != 0) { formatTime = displayDay + " d , " + displayHours + ':' + displayMinutes + ':' + displaySeconds }
    else { formatTime = displayHours + ':' + displayMinutes + ':' + displaySeconds }
    setSecondTime(formatTime);
  }


  const getEndBid = () => {
    if (etherStates.contract) {
      etherStates.contract.getAllBidsOfPost(Number(id)).then(res => {
        const endBid = res[res.length - 1]
        setBid(endBid)
      }).catch(err => { window.alert(err) })
    }
  }

  const getConfirnApprove = () => {
    if (etherStates.contract) {
      etherStates.contract.getIsSignPost(Number(id)).then(res => {
        const arr = []
        arr[0] = {approve:(res[0]).toString(),adr:confirmPost1};
        arr[1] = {approve:(res[1]).toString(),adr:confirmPost2};
        console.log(arr)
        setConfirm(arr)
      }).catch(err => { window.alert(err) })
    }
  }


  useEffect(() => {
    getEndBid()
    getConfirnApprove()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        displayCount(seconds)
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const decodeName = ethers.decodeBytes32String(name)

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <h5>Name : {decodeName}</h5>
        <h5>Time: {secondtime}</h5>
      </div>
      <div className={styles.details}>
        <span>Seller : {seller.substring(0, 4) + '...' + seller.slice(-4)}</span>
        <span>Min Bid : {(ethers.formatEther(minBid))} Eth</span>
      </div>
      <div className={styles.details}>
        <span>Auction Approvers :</span>
      </div>
      {confirm ? confirm.map((con, index) =>
        <div className={styles.details} key={index}>
          <span> {`${index + 1}`}- {(con.adr).substring(0, 4) + '...' + (con.adr).slice(-4)}</span>
          <h5>{" "} {con.approve}</h5>

        </div>

      ) : null}
      <div className={styles.details}>
        <h5>Last Bid : {bid ? ethers.formatEther(bid.amount) : 0} Eth</h5>
        <h5>buyer : {bid ? bid.buyer.substring(0, 4) + '...' + bid.buyer.slice(-4) : 0}</h5>
      </div>

      <div className={styles.details}>
        <Link href={`add-bid/${Number(id)}`} style={{ marginRight: 10 }}>Add Bid</Link>
        <Link href={`cancle-bid/${Number(id)}`} >Cancle Bid</Link>
      </div>

      <div className={styles.details}>
        <Link href={`confirm-action/${Number(id)}`} style={{ marginRight: 10 }}>Confirm Auction</Link>
        <Link href={`end-Auction/${Number(id)}`}>End Auction</Link>
      </div>

      <div className={styles.details}>
        <Link href={`showallbid/${Number(id)}`} style={{ marginRight: 10 }}>Show All Bid</Link>
      </div>

    </div >
  );
}

export default Card;


