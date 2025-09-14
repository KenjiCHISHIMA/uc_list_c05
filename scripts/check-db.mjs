import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aidjyufgsodkezvrnllp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZGp5dWZnc29ka2V6dnJubGxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ5MDAxMSwiZXhwIjoyMDczMDY2MDExfQ.sc9WjOO820qbYSXlpMm5AFO2FmrZBF5lCtCw2SfIuMo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('=== Supabase Database Check ===\n')

  try {
    // Check UC table
    console.log('1. UC Table:')
    const { data: ucData, error: ucError } = await supabase
      .from('uc')
      .select('*')
      .limit(5)

    if (ucError) {
      console.log('Error fetching UC table:', ucError.message)
    } else {
      console.log(`Found ${ucData?.length || 0} UC records`)
      if (ucData && ucData.length > 0) {
        console.log('Sample UC record:', JSON.stringify(ucData[0], null, 2))
      }
    }

    console.log('\n2. Wave Cycle Table:')
    const { data: wcData, error: wcError } = await supabase
      .from('wave_cycle')
      .select('*')
      .limit(5)

    if (wcError) {
      console.log('Error fetching wave_cycle table:', wcError.message)
    } else {
      console.log(`Found ${wcData?.length || 0} Wave Cycle records`)
      if (wcData && wcData.length > 0) {
        console.log('Sample Wave Cycle record:', JSON.stringify(wcData[0], null, 2))
      }
    }

    // Get total counts
    console.log('\n3. Total Counts:')
    const { count: ucCount } = await supabase
      .from('uc')
      .select('*', { count: 'exact', head: true })

    const { count: wcCount } = await supabase
      .from('wave_cycle')
      .select('*', { count: 'exact', head: true })

    console.log(`Total UC records: ${ucCount || 0}`)
    console.log(`Total Wave Cycle records: ${wcCount || 0}`)

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

checkDatabase()