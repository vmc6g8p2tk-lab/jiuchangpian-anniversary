import { invitation } from '../config/invitation'

export function BrandLogo({ variant = 'header' }: { variant?: 'header' | 'cover' | 'ending' }) {
  const logo = invitation.brand.logo
  return <span className={`brand-logo brand-logo-${variant}`}>
    <img src={`${import.meta.env.BASE_URL}${logo.src}`} alt={logo.alt} width={logo.width} height={logo.height} decoding="async" />
  </span>
}
