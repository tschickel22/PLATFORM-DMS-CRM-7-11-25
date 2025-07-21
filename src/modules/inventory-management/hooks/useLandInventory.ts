import { useState, useEffect } from 'react'
import { LandAsset, LandAssetFormData, generateLandAssetId, saveLandAssetsToStorage, loadLandAssetsFromStorage } from '../models/LandAsset'
import { mockLandAssets } from '@/mocks/mockLandAssets'

export function useLandInventory() {
  const [landAssets, setLandAssets] = useState<LandAsset[]>([])
  const [loading, setLoading] = useState(true)

  // Load land assets on mount
  useEffect(() => {
    const loadAssets = () => {
      try {
        const storedAssets = loadLandAssetsFromStorage()
        
        // If no stored assets, initialize with mock data
        if (storedAssets.length === 0) {
          setLandAssets(mockLandAssets.sampleLandAssets)
          saveLandAssetsToStorage(mockLandAssets.sampleLandAssets)
        } else {
          setLandAssets(storedAssets)
        }
      } catch (error) {
        console.error('Failed to load land assets:', error)
        // Fallback to mock data
        setLandAssets(mockLandAssets.sampleLandAssets)
      } finally {
        setLoading(false)
      }
    }

    loadAssets()
  }, [])

  // Save to localStorage whenever landAssets changes
  useEffect(() => {
    if (!loading && landAssets.length > 0) {
      saveLandAssetsToStorage(landAssets)
    }
  }, [landAssets, loading])

  const getLandAssets = (): LandAsset[] => {
    return landAssets
  }

  const getLandAssetById = (id: string): LandAsset | undefined => {
    return landAssets.find(asset => asset.id === id)
  }

  const getAvailableLandAssets = (): LandAsset[] => {
    return landAssets.filter(asset => asset.status === 'Available')
  }

  const getBundledLandAssets = (): LandAsset[] => {
    return landAssets.filter(asset => asset.status === 'Bundled')
  }

  const getLandAssetByInventoryId = (inventoryId: string): LandAsset | undefined => {
    return landAssets.find(asset => asset.linkedInventoryId === inventoryId)
  }

  const saveLandAsset = (formData: LandAssetFormData, id?: string): LandAsset => {
    const now = new Date().toISOString()
    
    if (id) {
      // Update existing asset
      const updatedAsset: LandAsset = {
        ...formData,
        id,
        createdAt: landAssets.find(a => a.id === id)?.createdAt || now,
        updatedAt: now
      }
      
      setLandAssets(prev => prev.map(asset => 
        asset.id === id ? updatedAsset : asset
      ))
      
      return updatedAsset
    } else {
      // Create new asset
      const newAsset: LandAsset = {
        ...formData,
        id: generateLandAssetId(),
        createdAt: now,
        updatedAt: now
      }
      
      setLandAssets(prev => [newAsset, ...prev])
      return newAsset
    }
  }

  const deleteLandAsset = (id: string): boolean => {
    try {
      setLandAssets(prev => prev.filter(asset => asset.id !== id))
      return true
    } catch (error) {
      console.error('Failed to delete land asset:', error)
      return false
    }
  }

  const updateLandAssetStatus = (id: string, status: LandAsset['status']): boolean => {
    try {
      setLandAssets(prev => prev.map(asset => 
        asset.id === id 
          ? { ...asset, status, updatedAt: new Date().toISOString() }
          : asset
      ))
      return true
    } catch (error) {
      console.error('Failed to update land asset status:', error)
      return false
    }
  }

  const searchLandAssets = (query: string): LandAsset[] => {
    if (!query.trim()) return landAssets
    
    const lowerQuery = query.toLowerCase()
    return landAssets.filter(asset => 
      asset.label.toLowerCase().includes(lowerQuery) ||
      asset.address.toLowerCase().includes(lowerQuery) ||
      asset.parcelNumber?.toLowerCase().includes(lowerQuery) ||
      asset.zoningType?.toLowerCase().includes(lowerQuery)
    )
  }

  const filterLandAssets = (filters: {
    status?: string
    ownershipStatus?: string
    zoningType?: string
    hasLinkedInventory?: boolean
  }): LandAsset[] => {
    return landAssets.filter(asset => {
      if (filters.status && asset.status !== filters.status) return false
      if (filters.ownershipStatus && asset.ownershipStatus !== filters.ownershipStatus) return false
      if (filters.zoningType && asset.zoningType !== filters.zoningType) return false
      if (filters.hasLinkedInventory !== undefined) {
        const hasLinked = !!asset.linkedInventoryId
        if (hasLinked !== filters.hasLinkedInventory) return false
      }
      return true
    })
  }

  // Placeholder for Phase 2 - bundling functionality
  const bundleToInventory = (inventoryId: string, landId: string): boolean => {
    // This will be implemented in Phase 2
    console.log('bundleToInventory will be implemented in Phase 2', { inventoryId, landId })
    return false
  }

  const bundleToInventory = (inventoryId: string, landId: string) => {
    // Update land asset to bundled status
    setLandAssets(prev => prev.map(asset => 
      asset.id === landId 
        ? { ...asset, linkedInventoryId: inventoryId, status: 'Bundled' as const }
        : asset
    ))
    
    // In a real app, you would also update the inventory item status
    // This would typically involve calling an inventory update function
    console.log(`Bundled land asset ${landId} with inventory ${inventoryId}`)
    
    return true
  }

  const unbundleLandAsset = (landId: string) => {
    setLandAssets(prev => prev.map(asset => 
      asset.id === landId 
        ? { ...asset, linkedInventoryId: undefined, status: 'Available' as const }
        : asset
    ))
    
    console.log(`Unbundled land asset ${landId}`)
    return true
  }

  const getLandAssetByInventoryId = (inventoryId: string) => {
    return landAssets.find(asset => asset.linkedInventoryId === inventoryId)
  }

  const getAvailableLandAssets = () => {
    return landAssets.filter(asset => asset.status === 'Available')
  }

  return {
    landAssets,
    loading,
    getLandAssets,
    getLandAssetById,
    getAvailableLandAssets,
    getBundledLandAssets,
    getLandAssetByInventoryId,
    saveLandAsset,
    deleteLandAsset,
    bundleToInventory,
    unbundleLandAsset,
    getLandAssetByInventoryId,
    getAvailableLandAssets,
    updateLandAssetStatus,
    searchLandAssets,
    filterLandAssets,
    bundleToInventory // Placeholder for Phase 2
  }
}