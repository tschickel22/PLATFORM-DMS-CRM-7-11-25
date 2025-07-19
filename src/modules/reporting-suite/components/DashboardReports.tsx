import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Package, DollarSign, BarChart3 } from 'lucide-react'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { mockReportingSuite } from '@/mocks/reportingSuiteMock'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function DashboardReports() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        // Use mock data
        const data = {
          widgets: mockReportingSuite.dashboardWidgets || [],
          reports: mockReportingSuite.sampleReportResults || {},
          categories: mockReportingSuite.reportCategories || [],
          timeRanges: mockReportingSuite.timeRangeOptions || []
        }
        setDashboardData(data)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setDashboardData({
          widgets: [],
          reports: {},
          categories: ['All'],
          timeRanges: [{ value: '30d', label: '30 Days' }]
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [selectedTimeRange, selectedCategory])

  const renderChart = (widget, reportData) => {
    if (!reportData || !reportData.data) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available
        </div>
      )
    }

    const { chartType, data } = reportData

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'numberCard':
        return (
          <div className="grid grid-cols-2 gap-4 h-full">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col justify-center items-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-sm text-muted-foreground text-center">{item.label}</div>
                {item.trend && (
                  <div className={`text-xs mt-1 ${item.color === 'green' ? 'text-green-600' : 'text-blue-600'}`}>
                    {item.trend}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Chart type not supported
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Reports</h1>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Reports</h1>
            <p className="text-muted-foreground">Error loading dashboard data</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground">Failed to load dashboard data</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { widgets, reports, categories, timeRanges } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Reports</h1>
          <p className="text-muted-foreground">
            Real-time insights and analytics for your business
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,083,000</div>
            <p className="text-xs text-green-600">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-green-600">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93</div>
            <p className="text-xs text-blue-600">51.6% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">66.7%</div>
            <p className="text-xs text-green-600">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((widget) => {
          const reportData = reports[widget.reportId]
          
          return (
            <Card key={widget.id} className={widget.size === 'large' ? 'md:col-span-2' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {widget.title}
                  <Badge variant="outline">{widget.type}</Badge>
                </CardTitle>
                <CardDescription>
                  {reportData?.title || 'Report data'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {renderChart(widget, reportData)}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Reports Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Reports</CardTitle>
          <CardDescription>
            Explore detailed analytics across different business areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {renderChart(
                        { type: 'bar' },
                        reports['crm-pipeline']
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quote Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {renderChart(
                        { type: 'numberCard' },
                        reports['quote-conversions']
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {renderChart(
                        { type: 'pie' },
                        reports['inventory-status']
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Units</span>
                        <span className="font-semibold">93</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available</span>
                        <span className="font-semibold text-green-600">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilization Rate</span>
                        <span className="font-semibold">51.6%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="service" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {renderChart(
                        { type: 'line' },
                        reports['service-performance']
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Service Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Tickets</span>
                        <span className="font-semibold">118</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Resolution Time</span>
                        <span className="font-semibold">2.3 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction</span>
                        <span className="font-semibold text-green-600">4.6/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="finance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {renderChart(
                        { type: 'bar' },
                        reports['finance-summary']
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Revenue</span>
                        <span className="font-semibold">$1,083,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Monthly</span>
                        <span className="font-semibold">$180,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Rate</span>
                        <span className="font-semibold text-green-600">+12.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}