import { useRouter } from 'next/router'
import AddBid from '../../component/templates/addBid'

export default function AddIndex() {
    const rout = useRouter()
    const id=rout.query.id || []    

  return (
    <div>
        <AddBid id={id}/>
    </div>
  )
}
