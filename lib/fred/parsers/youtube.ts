export type YouTubeData = {
  videoId: string
  title?: string
  timestamp?: number
  url: string
}

export function parseYouTube(text: string): YouTubeData | null {
  // Fångar youtu.be, youtube.com/watch, youtube.com/shorts, med t=
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?t=(\d+))?/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:.*t=(\d+))?/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  ]

  for (const p of patterns) {
    const match = text.match(p)
    if (match) {
      return {
        videoId: match[1],
        timestamp: match[2]? parseInt(match[2]) : undefined,
        url: `https://youtu.be/${match[1]}${match[2]? `?t=${match[2]}` : ''}`
      }
    }
  }
  return null
}