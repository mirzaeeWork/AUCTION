import styles from '../styles/HomePage.module.css'
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/constants"
import { useContext, useEffect, useState } from "react";
import Banner from "../component/modules/Banner";
import Card from "../component/modules/Card";
import { EtherContext } from '../utils/context';


export default function Home() {
  const { etherStates, setEtherState } = useContext(EtherContext)
  const updateEtherStates = { ...etherStates }



  return (
    <div className={styles.container}>
      {etherStates.account+1}
      <Banner />
      <div className={styles.subContainer}>
        {etherStates.listPost ?
          etherStates.listPost.map((post, index) => <Card key={index + 1} post={post} />)

          : null}
      </div>
    </div>
  )
}




