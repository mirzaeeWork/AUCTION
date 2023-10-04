import { useRouter } from 'next/router'
import ConfirmAuction from '../../component/templates/confirmAuction'

export default function ConfirmIndex() {
    const rout = useRouter()
    const id=rout.query.id || []    

  return (
    <div>
        <ConfirmAuction id={id}/>
    </div>
  )
}

