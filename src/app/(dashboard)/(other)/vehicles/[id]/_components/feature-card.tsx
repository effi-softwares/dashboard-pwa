import { Check, type LucideIcon, X } from "lucide-react"

type FeatureCardProps = {
  label: string
  enabled: boolean
  icon?: LucideIcon
  onToggle: () => void
}

function FeatureCard({ label, enabled, icon: Icon, onToggle }: FeatureCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`
      flex items-center gap-6 p-3 rounded-xl border-2 text-left w-full cursor-pointer
      ${
        enabled
          ? "bg-green-50/50 border-green-100 text-green-900 dark:bg-green-950/20 dark:border-green-900/30 dark:text-green-300"
          : "bg-muted/30 border-muted text-muted-foreground opacity-70 hover:opacity-100 hover:border-primary/20"
      }
    `}
    >
      <div
        className={`
      flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all group-active:scale-95
      ${enabled ? "bg-green-100 dark:bg-green-900/50 shadow-sm" : "bg-secondary"}
    `}
      >
        {enabled ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-sm truncate">
          {Icon && <Icon className="h-6 w-6" />}
          <p className="text-sm"> {label}</p>
        </div>
        <p className="uppercase font-bold tracking-tighter opacity-70">
          {enabled ? "Included" : "Not Available"}
        </p>
      </div>
    </button>
  )
}

export default FeatureCard
