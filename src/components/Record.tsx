import { invitation } from '../config/invitation'
export function Record({ className = '', spinning = true }: { className?: string; spinning?: boolean }) {
  return <div className={`vinyl ${spinning ? 'is-spinning' : ''} ${className}`} aria-hidden="true">
    <div className="vinyl-label"><span>{invitation.brand.shortName}</span><i /><small>{invitation.edition}</small></div>
  </div>
}
