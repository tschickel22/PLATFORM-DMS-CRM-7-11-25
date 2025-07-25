import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Plus, Edit, Trash2, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { CRMContact, Task } from '@/types'
import { NewLeadForm } from './NewLeadForm'
import { TaskForm } from './TaskForm'
import { useCrmTasks } from '@/hooks/useCrmTasks'
import { useToast } from '@/hooks/use-toast'

interface LeadDetailModalProps {
  lead: CRMContact
  onClose: () => void
  onLeadUpdate: (updatedLead: CRMContact) => void
}

export function LeadDetailModal({ lead, onClose, onLeadUpdate }: LeadDetailModalProps) {
  const { toast } = useToast()
  const { 
    getTasksByContact, 
    createTask, 
    updateTask, 
    deleteTask, 
    loading: tasksLoading,
    usingFallback 
  } = useCrmTasks()
  
  const [activeTab, setActiveTab] = useState('details')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const leadTasks = getTasksByContact(lead.id)

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'cancelled':
        return <X className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setShowTaskForm(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setShowTaskForm(true)
  }

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData)
      } else {
        await createTask(taskData)
      }
      setShowTaskForm(false)
      setSelectedTask(null)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId)
        toast({
          title: 'Task Deleted',
          description: 'Task has been deleted successfully.'
        })
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  }

  const handleLeadSuccess = (updatedLead: CRMContact) => {
    onLeadUpdate(updatedLead)
    toast({
      title: 'Lead Updated',
      description: `${updatedLead.first_name} ${updatedLead.last_name} has been updated.`
    })
  }

  return (
    <>
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={selectedTask}
          contactId={lead.id}
          contactName={`${lead.first_name} ${lead.last_name}`}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowTaskForm(false)
            setSelectedTask(null)
          }}
        />
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="shrink-0 border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {lead.first_name} {lead.last_name}
                  </CardTitle>
                  <CardDescription>
                    {lead.email} • {lead.phone}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="shrink-0 px-4 pt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Lead Details</TabsTrigger>
                    <TabsTrigger value="tasks">
                      Tasks ({leadTasks.length})
                      {usingFallback && (
                        <Badge variant="outline" className="ml-2 text-xs">Mock</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <TabsContent value="details" className="mt-4">
                    <NewLeadForm
                      lead={lead}
                      onClose={() => {}} // Don't close the modal when form is cancelled
                      onSuccess={handleLeadSuccess}
                      embedded={true} // Pass a prop to indicate this is embedded
                    />
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Tasks</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage tasks for {lead.first_name} {lead.last_name}
                        </p>
                      </div>
                      <Button onClick={handleCreateTask}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                      </Button>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-3">
                      {tasksLoading && (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                          <p className="text-muted-foreground mt-2 text-sm">Loading tasks...</p>
                        </div>
                      )}

                      {!tasksLoading && leadTasks.length > 0 && leadTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {getTaskStatusIcon(task.status)}
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge className={getTaskStatusColor(task.status)}>
                                {task.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground space-y-1">
                              {task.due_date && (
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              <div>
                                Created: {new Date(task.created_at).toLocaleDateString()}
                              </div>
                              {task.notes && (
                                <div className="mt-2">
                                  <p className="text-sm">{task.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {!tasksLoading && leadTasks.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>No tasks yet</p>
                          <p className="text-sm">Create your first task for this lead</p>
                          <Button onClick={handleCreateTask} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Task
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}