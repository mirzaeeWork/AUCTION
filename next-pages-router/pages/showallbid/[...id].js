import { useRouter } from 'next/router'
import ShowAllBid from '../../component/templates/showAllBid'

export default function AddIndex() {
    const rout = useRouter()
    const id=rout.query.id || []    

  return (
    <div>
        <ShowAllBid id={id}/>
    </div>
  )
}
