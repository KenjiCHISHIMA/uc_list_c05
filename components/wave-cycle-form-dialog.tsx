'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useUCStore } from '@/lib/store'
import { type WaveCycle } from '@/lib/supabase'

interface WaveCycleFormDialogProps {
  mode: 'create' | 'edit'
  waveCycle?: WaveCycle
  ucId?: string
  trigger: React.ReactNode
}

export function WaveCycleFormDialog({ mode, waveCycle, ucId, trigger }: WaveCycleFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    uc_id: ucId || '',
    description: '',
    start: '',
    end: '',
    cost: '',
    takenaka_poc: '',
    tcs_poc: ''
  })
  
  const { createWaveCycle, updateWaveCycle } = useUCStore()
  const { toast } = useToast()

  useEffect(() => {
    if (mode === 'edit' && waveCycle) {
      setFormData({
        id: waveCycle.id,
        uc_id: waveCycle.uc_id || '',
        description: waveCycle.description || '',
        start: waveCycle.start || '',
        end: waveCycle.end || '',
        cost: waveCycle.cost || '',
        takenaka_poc: waveCycle.takenaka_poc || '',
        tcs_poc: waveCycle.tcs_poc || ''
      })
    } else {
      setFormData({
        id: '',
        uc_id: ucId || '',
        description: '',
        start: '',
        end: '',
        cost: '',
        takenaka_poc: '',
        tcs_poc: ''
      })
    }
  }, [mode, waveCycle, ucId, open])

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
        await createWaveCycle(formData)
        toast({
          title: "作成完了",
          description: "Wave Cycleが正常に作成されました。"
        })
      } else {
        await updateWaveCycle(waveCycle!.id, {
          uc_id: formData.uc_id,
          description: formData.description,
          start: formData.start,
          end: formData.end,
          cost: formData.cost,
          takenaka_poc: formData.takenaka_poc,
          tcs_poc: formData.tcs_poc
        })
        toast({
          title: "更新完了",
          description: "Wave Cycleが正常に更新されました。"
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Wave Cycle作成' : 'Wave Cycle編集'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="UC01W1C1"
                disabled={mode === 'edit'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uc_id">UC ID</Label>
              <Input
                id="uc_id"
                value={formData.uc_id}
                onChange={(e) => setFormData(prev => ({ ...prev, uc_id: e.target.value }))}
                placeholder="UC01"
                disabled={mode === 'create' && !!ucId}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Wave Cycleの説明を入力"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">開始</Label>
              <Input
                id="start"
                value={formData.start}
                onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
                placeholder="開始日"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">終了</Label>
              <Input
                id="end"
                value={formData.end}
                onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
                placeholder="終了日"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">コスト</Label>
            <Input
              id="cost"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              placeholder="コスト"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="takenaka_poc">竹中担当者</Label>
              <Input
                id="takenaka_poc"
                value={formData.takenaka_poc}
                onChange={(e) => setFormData(prev => ({ ...prev, takenaka_poc: e.target.value }))}
                placeholder="竹中担当者"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tcs_poc">TCS担当者</Label>
              <Input
                id="tcs_poc"
                value={formData.tcs_poc}
                onChange={(e) => setFormData(prev => ({ ...prev, tcs_poc: e.target.value }))}
                placeholder="TCS担当者"
              />
            </div>
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