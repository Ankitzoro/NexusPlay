import { useStore } from '../../context/StoreContext'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null

  const icons = {
    success: <CheckCircle size={16} className="text-[#00ff88]" />,
    warn: <AlertTriangle size={16} className="text-[#f59e0b]" />,
    error: <XCircle size={16} className="text-[#f87171]" />,
  }

  const colors = {
    success: 'border-[#00ff8866] text-[#00ff88]',
    warn: 'border-[#f59e0b66] text-[#f59e0b]',
    error: 'border-[#f8717166] text-[#f87171]',
  }

  return (
    <div className={`toast flex items-center gap-2 ${colors[toast.type || 'success']}`}>
      {icons[toast.type || 'success']}
      <span className="font-rajdhani font-600">{toast.message}</span>
    </div>
  )
}
