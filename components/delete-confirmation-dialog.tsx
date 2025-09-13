'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface DeleteConfirmationDialogProps {
  title: string
  description: string
  onConfirm: () => Promise<void>
  trigger: React.ReactNode
}

export function DeleteConfirmationDialog({ title, description, onConfirm, trigger }: DeleteConfirmationDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      toast({
        title: "削除完了",
        description: "正常に削除されました。"
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "エラー",
        description: "削除に失敗しました。",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? '削除中...' : '削除'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}