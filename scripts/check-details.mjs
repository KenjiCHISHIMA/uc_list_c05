import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aidjyufgsodkezvrnllp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGp5dWZnc29ka2V6dnJubGxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ5MDAxMSwiZXhwIjoyMDczMDY2MDExfQ.sc9WjOO820qbYSXlpMm5AFO2FmrZBF5lCtCw2SfIuMo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDetails() {
  console.log('=== Detailed Database Content ===\n')

  // Get first 10 UCs to see variety
  const { data: ucs, error: ucError } = await supabase
    .from('uc')
    .select('*')
    .order('id')
    .limit(10)

  if (ucError) {
    console.log('Error:', ucError)
    return
  }

  console.log('UC Records (First 10):')
  console.log('========================')
  ucs.forEach(uc => {
    console.log(`\nID: ${uc.id}`)
    console.log(`Name: ${uc.name || 'N/A'}`)
    console.log(`Description: ${uc.description || 'N/A'}`)
    console.log(`Status: ${uc.status || 'N/A'}`)
  })

  // Get wave cycles for first UC
  console.log('\n\nWave Cycles for UC01:')
  console.log('======================')
  const { data: waves, error: waveError } = await supabase
    .from('wave_cycle')
    .select('*')
    .eq('uc_id', 'UC01')
    .order('id')

  if (waveError) {
    console.log('Error:', waveError)
    return
  }

  waves.forEach(wave => {
    console.log(`\nID: ${wave.id}`)
    console.log(`Description: ${wave.description || 'N/A'}`)
    console.log(`Period: ${wave.start || 'N/A'} ~ ${wave.end || 'N/A'}`)
    console.log(`Cost: ${wave.cost || 'N/A'}`)
    console.log(`Takenaka POC: ${wave.takenaka_poc || 'N/A'}`)
    console.log(`TCS POC: ${wave.tcs_poc || 'N/A'}`)
  })

  // Check for unique statuses
  console.log('\n\nUnique UC Statuses:')
  console.log('===================')
  const { data: statuses } = await supabase
    .from('uc')
    .select('status')

  const uniqueStatuses = [...new Set(statuses.map(s => s.status))].filter(Boolean)
  uniqueStatuses.forEach(status => {
    console.log(`- ${status}`)
  })
}

checkDetails()