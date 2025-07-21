import { useState, useEffect } from 'react'
import { LandAsset } from '../models/LandAsset'
import { mockLandAssets } from '@/mocks/mockLandAssets'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'

export function useLandInventory() {
  const [landAssets, setLandAssets] = useState<LandAsset[]>([])

  // Load data from localStorage on mount, fallback to mock data
  useEffect(() => {
    const savedAssets = loadFromLocalStorage<LandAsset[]>('landAssets', [])
    if (savedAssets.length > 0) {
      setLandAssets(savedAssets)
    } else {
      setLandAssets(mockLandAssets.sampleLandAssets)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (landAssets.length > 0) {
      saveToLocalStorage('landAssets', landAssets)
    }
  }, [landAssets])

  const createLandAsset = (assetData: Omit<LandAsset, 'id' | 'createdAt' | 'updatedAt'>): LandAsset => {
    const newAsset: LandAsset = {
      ...assetData,
      id: `land-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLandAssets(prev => [newAsset, ...prev])
    return newAsset
  }

  const updateLandAsset = (id: string, updates: Partial<LandAsset>) => {
    setLandAssets(prev => prev.map(asset => 
      asset.id === id 
        ? { ...asset, ...updates, updatedAt: new Date().toISOString() }
        : asset
    ))
  }

  const deleteLandAsset = (id: string) => {
    setLandAssets(prev => prev.filter(asset => asset.id !== id))
  }

  const getLandAssetById = (id: string): LandAsset | undefined => {
    return landAssets.find(asset => asset.id === id)
  }

  return {
    landAssets,
    createLandAsset,
    updateLandAsset,
    deleteLandAsset,
    getLandAssetById
  }
}