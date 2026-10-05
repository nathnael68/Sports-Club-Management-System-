import { useEffect, useState } from 'react'
import api from '../api/client'

interface Athlete {
  id: number
  full_name: string
  jersey_number: number
  playing_position: string
}

export default function Dashboard() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/athletes').then(r => setAthletes(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Athletes</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2"># Jersey</th>
            <th className="border p-2">Position</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map(a => (
            <tr key={a.id}>
              <td className="border p-2">{a.full_name}</td>
              <td className="border p-2">{a.jersey_number}</td>
              <td className="border p-2">{a.playing_position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}