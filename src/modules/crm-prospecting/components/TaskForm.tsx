import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save, Plus } from 'lucide-react'
import { Task } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface TaskFormProps {
  task?: Task | null
  contactId: string
  contactName: string
  onSave: (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

export function TaskForm({ task, contactId, contactName, onSave, onCancel }: TaskFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    status: 'open',
    due_date: '',
    notes: ''
  })

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        status: task.status || 'open',
        due_date: task.due_date || '',
        notes: task.notes || ''
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Task title is required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave({
        contact_id: contactId,
        title: formData.title.trim(),
        status: formData.status,
        due_date: formData.due_date || undefined,
        notes: formData.notes.trim() || undefined
      })
      
      toast({
        title: 'Success',
        description: `Task ${task ? 'updated' : 'created'} successfully`
      })
      
      onCancel() // Close the form
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      status: 'open',
      due_date: '',
      notes: ''
    })
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{task ? 'Edit Task' : 'New Task'}</CardTitle>
              <CardDescription>
                {task ? 'Update task details' : `Create a new task for ${contactName}`}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {task ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {task ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {task ? 'Update Task' : 'Create Task'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}