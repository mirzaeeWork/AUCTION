import Link from "next/link";
import styles from "./Banner.module.css";

function Banner() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2>Auction</h2>
        <p>A brief description of the auction!</p>
        <span>
          Auctions are used for a wide range of assets, including art, real estate, antiques, collectibles,
          and even digital goods. They serve as a dynamic marketplace where supply and demand
          determine the final price, making them a popular method for buying and selling valuable items.
        </span>
      </div>
      <div className={styles.right}>
        <img src="/images/auction.jpg" alt="Auction image" />
      </div>
    </div>
  );
}

export default Banner;