'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useUCStore } from '@/lib/store'
import { type UC } from '@/lib/supabase'

interface UCFormDialogProps {
  mode: 'create' | 'edit'
  uc?: UC
  trigger: React.ReactNode
}

export function UCFormDialog({ mode, uc, trigger }: UCFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    status: ''
  })
  
  const { createUC, updateUC } = useUCStore()
  const { toast } = useToast()

  useEffect(() => {
    if (mode === 'edit' && uc) {
      setFormData({
        id: uc.id,
        name: uc.name || '',
        description: uc.description || '',
        status: uc.status || ''
      })
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        status: ''
      })
    }
  }, [mode, uc, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.id.trim()) {
      toast({
        title: "エラー",
        description: "IDを入力してください。",
        variant: "destructive"
      })
      return
    }

    try {
      if (mode === 'create') {
        await createUC(formData)
        toast({
          title: "作成完了",
          description: "UCが正常に作成されました。"
        })
      } else {
        await updateUC(uc!.id, {
          name: formData.name,
          description: formData.description,
          status: formData.status
        })
        toast({
          title: "更新完了",
          description: "UCが正常に更新されました。"
        })
      }
      setOpen(false)
    } catch (error) {
      toast({
        title: "エラー",
        description: "操作に失敗しました。",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'UC作成' : 'UC編集'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              placeholder="UC01"
              disabled={mode === 'edit'}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="UC名を入力"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="UCの説明を入力"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">ステータス</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="進行中">進行中</SelectItem>
                <SelectItem value="完了">完了</SelectItem>
                <SelectItem value="保留">保留</SelectItem>
                <SelectItem value="キャンセル">キャンセル</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit">
              {mode === 'create' ? '作成' : '更新'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}