import { useEffect } from "react"
import style from "./Layout.module.css"
import Link from "next/link"
import ConnectToContract from "../modules/ConnectToContract"


export default function Layout({ children }) {




  return (
    <>
      <header className={style.header}>
        <div className={style.left}>
          <Link href="/">Auction</Link>
        </div>
        <div className={style.rigth}>
          <Link href="/add-auction">Add Auction</Link>
          <ConnectToContract/>
          {/* <a  onClick={connectToWallet}>connect</a> */}
        </div>
      </header>
      <div className={style.container}>
        {children}
      </div>
      <footer className={style.footer}>
        <a href="https://google.com" target="_blank" rel="noreferrer">
          Auction
        </a>

      </footer>
    </>
  )
}
