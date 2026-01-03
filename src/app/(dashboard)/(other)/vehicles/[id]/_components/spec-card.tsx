import { PropsWithChildren, useState } from "react"

import { EditIcon, Loader2, type LucideIcon, Save } from "lucide-react"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { FatButton } from "@/components/ui/fat-button"

type SpecCardProps = PropsWithChildren<{
  icon: LucideIcon
  label: string
  value: string | number | boolean
  alertDescription?: string
  onSave?: (isDirty: boolean) => Promise<void>
  isDirty?: boolean
  isLoading?: boolean
}>

function SpecCard({
  icon: Icon,
  label,
  value,
  alertDescription,
  children,
  onSave,
  isDirty = false,
  isLoading = false,
}: SpecCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setError(null)
      if (onSave && isDirty) {
        await onSave(isDirty)
        setIsOpen(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save changes"
      setError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 rounded-2xl border bg-background">
      <div className="flex items-center gap-3 space-y-3">
        <div className="rounded-lg text-secondary-foreground border p-2">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-lg font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="ml-auto">
          <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
            <ResponsiveDialogTrigger>
              <Button size="icon" variant="ghost" className="ml-auto px-2" asChild>
                <EditIcon />
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>{label}</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <ResponsiveDialogDescription>
                {alertDescription && <span>{alertDescription}</span>}
                {error && <span className="text-red-500 block mt-2">{error}</span>}
              </ResponsiveDialogDescription>
              {children}
              <ResponsiveDialogFooter>
                <div className="flex w-full justify-between align-center gap-4">
                  <FatButton
                    type="button"
                    variant="ghost"
                    className="flex items-center gap-2 text-sky-700 bg-transparent hover:bg-transparent hover:underline hover:text-sky-600"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </FatButton>
                  <FatButton
                    onClick={handleSave}
                    disabled={!isDirty || isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p>Saving...</p>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <p>Save</p>
                      </>
                    )}
                  </FatButton>
                </div>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </div>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

export default SpecCard
