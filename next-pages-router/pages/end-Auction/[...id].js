import { useRouter } from 'next/router'
import EndAuction from '../../component/templates/endAuction'

export default function EndTransaction() {
    const rout = useRouter()
    const id=rout.query.id || []    

  return (
    <div><EndAuction id={id}/></div>
  )
}
