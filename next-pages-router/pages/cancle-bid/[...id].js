import { useRouter } from 'next/router'
import CancleBid from '../../component/templates/cancleBid'

export default function CancleIndex() {
    const rout = useRouter()
    const id=rout.query.id || []    

  return (
    <div>
        <CancleBid id={id}/>
    </div>
  )
}

