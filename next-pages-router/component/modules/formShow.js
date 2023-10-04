
export default function FormShow({ nameAmount, nameBuyer, labelAmount, labelBuyer,nameWithdrawMoney,labelWithdrawMoney }) {
    return (
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
            <div>
                <label >{nameBuyer} </label>
                <label > {labelBuyer}</label>
            </div>
            <div>
                <label >{nameAmount} </label>
                <label > {labelAmount} ETH</label>
            </div>
            <div>
                <label >{nameWithdrawMoney} </label>
                <label > {labelWithdrawMoney}</label>
            </div>

        </div>
    )
}
