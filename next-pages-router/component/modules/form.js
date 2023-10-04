import FormInput from './formInput'

export default function Form({ form, setForm }) {
  const changeHandler = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }
  return (
    <div >
      <FormInput
        name="name"
        label="Name"
        type="text"
        value={form.name}
        onChange={changeHandler}
      />
      <FormInput
        name="minBid"
        label="Minimum bid"
        type="text"
        value={form.minBid}
        onChange={changeHandler}
      />
      <FormInput
        name="biddingTime"
        label="Auction Time"
        type="text"
        value={form.biddingTime}
        onChange={changeHandler}
      />
      <FormInput
        name="address1"
        label="First address to confirm"
        type="tel"
        value={form.address1}
        onChange={changeHandler}
      />
      <FormInput
        name="address2"
        label="Second address to confirm"
        type="text"
        value={form.address2}
        onChange={changeHandler}
      />
    </div>
  )
}
