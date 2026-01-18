'use client'

interface ShareHeaderProps {
  customerCompanyName: string
  customerLogoUrl: string | null
  presentationTitle: string
}

export function ShareHeader({
  customerCompanyName,
  customerLogoUrl,
  presentationTitle,
}: ShareHeaderProps) {
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
      >
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {customerLogoUrl ? (
              <img src={customerLogoUrl} alt={customerCompanyName} className="h-6 object-contain rounded-md" />
            ) : (
              <div
                className="h-6 w-6 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: 'var(--brand-primary, #3B82F6)' }}
              >
                {customerCompanyName[0]}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground">{customerCompanyName}</span>
              <span className="text-foreground-subtle">·</span>
              <span className="text-xs text-foreground-muted">{presentationTitle}</span>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
