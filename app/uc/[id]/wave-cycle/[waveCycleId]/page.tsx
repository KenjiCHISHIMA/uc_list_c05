'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react'
import { useUCStore } from '@/lib/store'
import { WaveCycleFormDialog } from '@/components/wave-cycle-form-dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'

export default function WaveCycleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ucId = params.id as string
  const waveCycleId = params.waveCycleId as string
  
  const { waveCycles, loading, fetchWaveCycles, deleteWaveCycle } = useUCStore()

  const waveCycle = waveCycles.find(wc => wc.id === waveCycleId)

  useEffect(() => {
    fetchWaveCycles()
  }, [fetchWaveCycles])

  const handleDeleteWaveCycle = async () => {
    await deleteWaveCycle(waveCycleId)
    router.push(`/uc/${ucId}`)
  }

  if (loading && !waveCycle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  if (!waveCycle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Wave Cycleが見つかりません</h2>
          <Button onClick={() => router.push(`/uc/${ucId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push(`/uc/${ucId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
              <h1 className="text-2xl font-bold">Wave Cycle詳細: {waveCycle.id}</h1>
            </div>
            <div className="flex gap-2">
              <WaveCycleFormDialog 
                mode="edit" 
                waveCycle={waveCycle} 
                trigger={
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    編集
                  </Button>
                }
              />
              <WaveCycleFormDialog 
                mode="create" 
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    作成
                  </Button>
                }
              />
              <DeleteConfirmationDialog
                title="Wave Cycle削除"
                description={`Wave Cycle「${waveCycle.id}」を削除しますか？`}
                onConfirm={handleDeleteWaveCycle}
                trigger={
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Wave Cycle情報</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">ID</h3>
              <p className="text-lg">{waveCycle.id}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">UC ID</h3>
              <p className="text-lg">{waveCycle.uc_id || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">開始</h3>
              <p className="text-lg">{waveCycle.start || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">終了</h3>
              <p className="text-lg">{waveCycle.end || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">コスト</h3>
              <p className="text-lg">{waveCycle.cost || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">竹中担当者</h3>
              <p className="text-lg">{waveCycle.takenaka_poc || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">TCS担当者</h3>
              <p className="text-lg">{waveCycle.tcs_poc || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium text-sm text-muted-foreground mb-2">説明</h3>
              <p className="text-lg">{waveCycle.description || '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}