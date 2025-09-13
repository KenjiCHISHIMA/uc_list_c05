'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from 'lucide-react'
import { useUCStore } from '@/lib/store'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const { ucs, loading, fetchUCs } = useUCStore()
  const router = useRouter()

  useEffect(() => {
    fetchUCs()
  }, [fetchUCs])

  const filteredUCs = useMemo(() => {
    if (!searchQuery) return ucs
    
    return ucs.filter(uc => 
      uc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (uc.name && uc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (uc.description && uc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (uc.status && uc.status.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [ucs, searchQuery])

  const handleRowClick = (ucId: string) => {
    router.push(`/uc/${ucId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed header */}
      <div className="sticky top-0 z-20 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">UC管理システム</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="ID、名前、説明、ステータスで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table container with scrollable area */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">名前</TableHead>
                <TableHead className="font-semibold">説明</TableHead>
                <TableHead className="font-semibold">ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    読み込み中...
                  </TableCell>
                </TableRow>
              ) : filteredUCs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? '検索結果が見つかりません' : 'UCが見つかりません'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUCs.map((uc) => (
                  <TableRow 
                    key={uc.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(uc.id)}
                  >
                    <TableCell className="font-medium">{uc.id}</TableCell>
                    <TableCell>{uc.name || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">{uc.description || '-'}</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}