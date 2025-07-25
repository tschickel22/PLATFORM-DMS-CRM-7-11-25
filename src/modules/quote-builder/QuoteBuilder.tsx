import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  DollarSign,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react'
import { useQuoteManagement } from './hooks/useQuoteManagement'
import { formatCurrency, formatDate } from '@/lib/utils'

function QuoteBuilderDashboard() {
  const {
    quotes,
    loading,
    error,
    createQuote,
    updateQuote,
    deleteQuote,
    refreshQuotes
  } = useQuoteManagement()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  // Filter quotes based on search and filters
  const filteredQuotes = React.useMemo(() => {
    let filtered = quotes

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(quote =>
        quote.id.toLowerCase().includes(query) ||
        quote.customer_id.toLowerCase().includes(query) ||
        quote.notes?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter)
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter(quote => {
        const quoteDate = new Date(quote.created_at || '')
        return quoteDate >= filterDate
      })
    }

    return filtered
  }, [quotes, searchQuery, statusFilter, dateFilter])

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalQuotes = quotes.length
    const draftQuotes = quotes.filter(q => q.status === 'draft').length
    const sentQuotes = quotes.filter(q => q.status === 'sent').length
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length
    const totalValue = quotes.reduce((sum, quote) => sum + (quote.price || 0), 0)

    return {
      totalQuotes,
      draftQuotes,
      sentQuotes,
      acceptedQuotes,
      totalValue,
      conversionRate: sentQuotes > 0 ? ((acceptedQuotes / sentQuotes) * 100).toFixed(1) : '0'
    }
  }, [quotes])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'viewed':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateQuote = () => {
    // Disabled in read-only mode
    createQuote({
      customer_id: '',
      inventory_id: '',
      price: 0,
      discount: 0,
      status: 'draft'
    })
  }

  const handleEditQuote = (quoteId: string) => {
    // Disabled in read-only mode
    console.log('[Quote Builder] Edit quote disabled in read-only mode:', quoteId)
  }

  const handleDeleteQuote = (quoteId: string) => {
    // Disabled in read-only mode
    deleteQuote(quoteId)
  }

  return (
    <div className="space-y-6">
      {/* Supabase Status Banner */}
      <Alert>
        <AlertDescription>
          <strong>Quote Builder:</strong> Reading from live Supabase tables: <code>quotes</code>, <code>quote_items</code>
          {error && <span className="text-orange-600 ml-2">• {error}</span>}
        </AlertDescription>
      </Alert>

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Quote Builder</h1>
            <p className="ri-page-description">
              Create and manage customer quotes and estimates
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={refreshQuotes} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreateQuote} disabled>
              <Plus className="h-4 w-4 mr-2" />
              New Quote (Disabled)
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.draftQuotes} draft, {stats.sentQuotes} sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all quotes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : `${stats.conversionRate}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.acceptedQuotes} accepted quotes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quotes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : quotes.filter(q => ['sent', 'viewed'].includes(q.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting customer response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Quotes</CardTitle>
          <CardDescription>
            Manage customer quotes and estimates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotes by ID, customer, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px]"
              title="Filter by creation date (on or after)"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading quotes...</p>
            </div>
          )}

          {/* Quotes List */}
          {!loading && (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">Quote #{quote.id.slice(-6).toUpperCase()}</h4>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span> {quote.customer_id}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> {formatCurrency(quote.price || 0)}
                      </div>
                      <div>
                        <span className="font-medium">Discount:</span> {formatCurrency(quote.discount || 0)}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(quote.created_at || '')}
                      </div>
                    </div>
                    {quote.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{quote.notes}</p>
                    )}
                    {quote.items && quote.items.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">
                          {quote.items.length} item(s) • Total: {formatCurrency(
                            quote.items.reduce((sum, item) => sum + (item.total_price || 0), 0)
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('View quote:', quote.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuote(quote.id)}
                      disabled
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuote(quote.id)}
                      disabled
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredQuotes.length === 0 && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  {quotes.length === 0 ? (
                    <>
                      <p>No quotes found</p>
                      <p className="text-sm">Quotes will appear here when available in the database</p>
                    </>
                  ) : (
                    <>
                      <p>No quotes match your criteria</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function QuoteBuilder() {
  return (
    <Routes>
      <Route path="/" element={<QuoteBuilderDashboard />} />
      <Route path="/*" element={<QuoteBuilderDashboard />} />
    </Routes>
  )
}