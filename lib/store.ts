'use client'

import { create } from 'zustand'
import { supabase, type UC, type WaveCycle } from './supabase'

interface UCStore {
  ucs: UC[]
  waveCycles: WaveCycle[]
  loading: boolean
  
  // UC operations
  fetchUCs: () => Promise<void>
  createUC: (data: Omit<UC, 'id'> & { id: string }) => Promise<void>
  updateUC: (id: string, data: Omit<UC, 'id'>) => Promise<void>
  deleteUC: (id: string) => Promise<void>
  
  // WaveCycle operations
  fetchWaveCycles: (ucId?: string) => Promise<void>
  createWaveCycle: (data: Omit<WaveCycle, 'id'> & { id: string }) => Promise<void>
  updateWaveCycle: (id: string, data: Omit<WaveCycle, 'id'>) => Promise<void>
  deleteWaveCycle: (id: string) => Promise<void>
}

export const useUCStore = create<UCStore>((set, get) => ({
  ucs: [],
  waveCycles: [],
  loading: false,

  fetchUCs: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('uc')
        .select('*')
        .order('id')
      
      if (error) throw error
      set({ ucs: data || [] })
    } catch (error) {
      console.error('Error fetching UCs:', error)
    } finally {
      set({ loading: false })
    }
  },

  createUC: async (data) => {
    const { error } = await supabase
      .from('uc')
      .insert(data)
    
    if (error) throw error
    await get().fetchUCs()
  },

  updateUC: async (id, data) => {
    const { error } = await supabase
      .from('uc')
      .update(data)
      .eq('id', id)
    
    if (error) throw error
    await get().fetchUCs()
  },

  deleteUC: async (id) => {
    // Delete related wave_cycles first
    await supabase
      .from('wave_cycle')
      .delete()
      .eq('uc_id', id)

    const { error } = await supabase
      .from('uc')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await get().fetchUCs()
  },

  fetchWaveCycles: async (ucId) => {
    set({ loading: true })
    try {
      let query = supabase
        .from('wave_cycle')
        .select('*')
        .order('id')
      
      if (ucId) {
        query = query.eq('uc_id', ucId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      set({ waveCycles: data || [] })
    } catch (error) {
      console.error('Error fetching wave cycles:', error)
    } finally {
      set({ loading: false })
    }
  },

  createWaveCycle: async (data) => {
    const { error } = await supabase
      .from('wave_cycle')
      .insert(data)
    
    if (error) throw error
    await get().fetchWaveCycles(data.uc_id || undefined)
  },

  updateWaveCycle: async (id, data) => {
    const { error } = await supabase
      .from('wave_cycle')
      .update(data)
      .eq('id', id)
    
    if (error) throw error
    const currentWC = get().waveCycles.find(wc => wc.id === id)
    await get().fetchWaveCycles(currentWC?.uc_id || undefined)
  },

  deleteWaveCycle: async (id) => {
    const currentWC = get().waveCycles.find(wc => wc.id === id)
    const { error } = await supabase
      .from('wave_cycle')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await get().fetchWaveCycles(currentWC?.uc_id || undefined)
  }
}))