'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react'
import { useUCStore } from '@/lib/store'
import { UCFormDialog } from '@/components/uc-form-dialog'
import { WaveCycleFormDialog } from '@/components/wave-cycle-form-dialog'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'

export default function UCDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ucId = params.id as string
  
  const { ucs, waveCycles, loading, fetchUCs, fetchWaveCycles, deleteUC, deleteWaveCycle } = useUCStore()

  const uc = ucs.find(u => u.id === ucId)
  const relatedWaveCycles = waveCycles.filter(wc => wc.uc_id === ucId)

  useEffect(() => {
    if (!ucs.length) {
      fetchUCs()
    }
    fetchWaveCycles(ucId)
  }, [ucId, fetchUCs, fetchWaveCycles, ucs.length])

  const handleWaveCycleClick = (waveCycleId: string) => {
    router.push(`/uc/${ucId}/wave-cycle/${waveCycleId}`)
  }

  const handleDeleteUC = async () => {
    await deleteUC(ucId)
    router.push('/')
  }

  if (loading && !uc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  if (!uc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">UCが見つかりません</h2>
          <Button onClick={() => router.push('/')}>
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
              <Button variant="outline" onClick={() => router.push('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
              <h1 className="text-2xl font-bold">UC詳細: {uc.id}</h1>
            </div>
            <div className="flex gap-2">
              <UCFormDialog 
                mode="edit" 
                uc={uc} 
                trigger={
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    編集
                  </Button>
                }
              />
              <UCFormDialog 
                mode="create" 
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    作成
                  </Button>
                }
              />
              <DeleteConfirmationDialog
                title="UC削除"
                description={`UC「${uc.id}」を削除しますか？関連するWave Cycleもすべて削除されます。`}
                onConfirm={handleDeleteUC}
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

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* UC Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>UC情報</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">ID</h3>
              <p className="text-lg">{uc.id}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">名前</h3>
              <p className="text-lg">{uc.name || '-'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">ステータス</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                uc.status === '完了' 
                  ? 'bg-green-100 text-green-800' 
                  : uc.status === '進行中'
                  ? 'bg-blue-100 text-blue-800'
                  : uc.status === '保留'
                  ? 'bg-yellow-100 text-yellow-800'
                  : uc.status === 'キャンセル'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {uc.status || '-'}
              </span>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-medium text-sm text-muted-foreground">説明</h3>
              <p className="text-lg">{uc.description || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Wave Cycles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>関連Wave Cycle</CardTitle>
                <CardDescription>このUCに関連するWave Cycleの一覧</CardDescription>
              </div>
              <WaveCycleFormDialog 
                mode="create" 
                ucId={ucId}
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    作成
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-card rounded-lg border max-h-[50vh] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">説明</TableHead>
                    <TableHead className="font-semibold">開始</TableHead>
                    <TableHead className="font-semibold">終了</TableHead>
                    <TableHead className="font-semibold">コスト</TableHead>
                    <TableHead className="font-semibold">竹中担当者</TableHead>
                    <TableHead className="font-semibold">TCS担当者</TableHead>
                    <TableHead className="font-semibold">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedWaveCycles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        関連するWave Cycleがありません
                      </TableCell>
                    </TableRow>
                  ) : (
                    relatedWaveCycles.map((waveCycle) => (
                      <TableRow 
                        key={waveCycle.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleWaveCycleClick(waveCycle.id)}
                      >
                        <TableCell className="font-medium">{waveCycle.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{waveCycle.description || '-'}</TableCell>
                        <TableCell>{waveCycle.start || '-'}</TableCell>
                        <TableCell>{waveCycle.end || '-'}</TableCell>
                        <TableCell>{waveCycle.cost || '-'}</TableCell>
                        <TableCell>{waveCycle.takenaka_poc || '-'}</TableCell>
                        <TableCell>{waveCycle.tcs_poc || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <WaveCycleFormDialog 
                              mode="edit" 
                              waveCycle={waveCycle}
                              trigger={
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              }
                            />
                            <DeleteConfirmationDialog
                              title="Wave Cycle削除"
                              description={`Wave Cycle「${waveCycle.id}」を削除しますか？`}
                              onConfirm={() => deleteWaveCycle(waveCycle.id)}
                              trigger={
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}