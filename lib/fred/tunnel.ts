import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createAtom(userId: string, source: string, type: string, payload: any) {
  const { data: atom, error } = await supabase
   .from('atoms')
   .insert({ user_id: userId, source, type, payload })
   .select()
   .single()

  if (error) throw error

  // Hitta alla användarens aktiva devices och skapa tunnels
  const { data: devices } = await supabase
   .from('devices')
   .select('id')
   .eq('user_id', userId)

  if (devices?.length) {
    const tunnels = devices.map(d => ({ atom_id: atom.id, device_id: d.id }))
    await supabase.from('tunnels').insert(tunnels)
  }

  return atom
}

export async function getPendingTunnels(deviceId: string) {
  const { data } = await supabase
   .from('tunnels')
   .select('*, atoms(*)')
   .eq('device_id', deviceId)
   .eq('status', 'pending')
   .order('created_at', { ascending: false })

  return data || []
}