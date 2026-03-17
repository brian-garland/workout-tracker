interface CautionBannerProps {
  message: string
}

export function CautionBanner({ message }: CautionBannerProps) {
  return (
    <div className="flex items-start gap-2 bg-warning/10 border border-warning/30 rounded-xl px-3 py-2.5">
      <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span className="text-sm text-warning">{message}</span>
    </div>
  )
}
