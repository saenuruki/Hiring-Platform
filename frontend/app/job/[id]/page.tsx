import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 仮のデータ
const job = {
  id: 1,
  title: "ソフトウェアエンジニア",
  company: "テックCorp",
  location: "東京",
  description: "私たちは、革新的な技術ソリューションを開発する情熱的なソフトウェアエンジニアを探しています。...",
  requirements: [
    "コンピューターサイエンスまたは関連分野の学位",
    "3年以上のソフトウェア開発経験",
    "JavaScript、Python、Javaのいずれかに精通していること",
  ],
}

const candidates = [
  { id: 1, name: "山田太郎", experience: "5年" },
  { id: 2, name: "佐藤花子", experience: "3年" },
  { id: 3, name: "鈴木一郎", experience: "7年" },
]

export default function JobDetail({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>求人詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            <strong>会社:</strong> {job.company}
          </p>
          <p className="mb-2">
            <strong>場所:</strong> {job.location}
          </p>
          <p className="mb-4">{job.description}</p>
          <h3 className="text-xl font-semibold mb-2">要件:</h3>
          <ul className="list-disc pl-5">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">応募者一覧</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardHeader>
              <CardTitle>{candidate.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">経験: {candidate.experience}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button>求人一覧に戻る</Button>
        </Link>
      </div>
    </main>
  )
}

