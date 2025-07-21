export interface LandAsset {
  id: string
  label: string
  parcelNumber?: string
  address: string
  lotSizeSqFt?: number
  zoningType?: string
  utilityStatus?: string
  ownershipStatus: 'Dealer-Owned' | 'Third-Party' | 'Leased'
  linkedInventoryId?: string
  pricing?: {
    salePrice?: number
    leaseRate?: number
    rentToOwn?: boolean
  }
  status: 'Available' | 'Bundled' | 'Sold' | 'Archived'
  createdAt: string
  updatedAt: string
}

export interface LandAssetFormData {
  label: string
  parcelNumber?: string
  address: string
  lotSizeSqFt?: number
  zoningType?: string
  utilityStatus?: string
  ownershipStatus: 'Dealer-Owned' | 'Third-Party' | 'Leased'
  pricing?: {
    salePrice?: number
    leaseRate?: number
    rentToOwn?: boolean
  }
  status: 'Available' | 'Bundled' | 'Sold' | 'Archived'
}

// Local storage utilities for land assets
export const LAND_ASSETS_STORAGE_KEY = 'renter-insight-land-assets'

export function saveLandAssetsToStorage(assets: LandAsset[]): void {
  try {
    localStorage.setItem(LAND_ASSETS_STORAGE_KEY, JSON.stringify(assets))
  } catch (error) {
    console.error('Failed to save land assets to localStorage:', error)
  }
}

export function loadLandAssetsFromStorage(): LandAsset[] {
  try {
    const stored = localStorage.getItem(LAND_ASSETS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load land assets from localStorage:', error)
    return []
  }
}

export function generateLandAssetId(): string {
  return `land-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}