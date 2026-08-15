import { createAtom } from '../tunnel'
import { parseYouTube } from '../parsers/youtube'

export async function handleTunnelClip(userId: string, sharedText: string, file?: File) {
  // Fall 1: Användaren delar YouTube/TikTok-länk från CapCut
  const yt = parseYouTube(sharedText)
  if (yt) {
    return createAtom(userId, 'capcut', 'video', {
      type: 'youtube',
     ...yt,
      action: 'open_premiere' // Desktop lyssnar på detta
    })
  }

  // Fall 2: Användaren delar faktisk videofil
  if (file && file.type.startsWith('video/')) {
    // I v1: bara skicka filnamn + storlek. V2: ladda upp till Drive.
    return createAtom(userId, 'capcut', 'video', {
      type: 'file',
      name: file.name,
      size: file.size,
      action: 'download_to_desktop'
    })
  }

  throw new Error('TunnelClip: Kunde inte parsa. Dela från CapCut eller skicka YouTube-länk.')
}