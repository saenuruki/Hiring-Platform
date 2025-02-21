import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// 仮のデータ
const jobs = [
  { id: 1, title: "ソフトウェアエンジニア", company: "テックCorp", location: "東京" },
  { id: 2, title: "プロダクトマネージャー", company: "イノベーションInc", location: "大阪" },
  { id: 3, title: "UXデザイナー", company: "クリエイティブLab", location: "福岡" },
]

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">求人一覧</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="text-sm text-muted-foreground">{job.location}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/job/${job.id}`}>
                <Button>詳細を見る</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/job/create">
          <Button>新しい求人を作成</Button>
        </Link>
      </div>
    </main>
  )
}

