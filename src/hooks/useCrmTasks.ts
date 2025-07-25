import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Task } from '@/types'
import { useToast } from '@/hooks/use-toast'

// Mock task data for fallback
const mockTasks: Task[] = [
  {
    id: 'task-001',
    contact_id: 'cust-001',
    title: 'Follow up on initial inquiry',
    status: 'open',
    due_date: '2024-02-15',
    created_at: '2024-01-10T09:30:00Z',
    notes: 'Customer interested in RV financing options'
  },
  {
    id: 'task-002',
    contact_id: 'cust-001',
    title: 'Schedule property viewing',
    status: 'completed',
    due_date: '2024-01-20',
    created_at: '2024-01-12T14:20:00Z',
    notes: 'Viewing completed, customer very interested'
  },
  {
    id: 'task-003',
    contact_id: 'cust-002',
    title: 'Send financing options',
    status: 'open',
    due_date: '2024-02-10',
    created_at: '2024-01-15T11:45:00Z',
    notes: 'Customer requested detailed financing breakdown'
  }
]

export function useCrmTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const { toast } = useToast()

  // Load tasks from Supabase
  const loadTasks = async () => {
    console.log('🔄 [CRM Tasks] Loading tasks from Supabase...')
    
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('⚠️ [CRM Tasks] Supabase not configured, using fallback')
      setTasks(mockTasks)
      setUsingFallback(true)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('crm_tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ [CRM Tasks] Supabase error:', error.message)
        throw error
      }

      if (!Array.isArray(data)) {
        console.warn('⚠️ [CRM Tasks] Invalid data format from Supabase')
        throw new Error('Invalid data format')
      }

      console.log(`✅ [CRM Tasks] Loaded ${data.length} tasks from Supabase`)
      
      // Transform data to match our Task interface
      const transformedTasks: Task[] = data.map(row => ({
        id: row.id,
        contact_id: row.contact_id,
        title: row.title || 'Untitled Task',
        status: row.status || 'open',
        due_date: row.due_date,
        created_at: row.created_at,
        updated_at: row.updated_at,
        notes: row.notes
      }))

      setTasks(transformedTasks)
      setUsingFallback(false)
    } catch (error) {
      console.error('💥 [CRM Tasks] Failed to load from Supabase:', error)
      console.log('🔄 [CRM Tasks] Using fallback mock data')
      setTasks(mockTasks)
      setUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }

  // Load tasks on mount
  useEffect(() => {
    loadTasks()
  }, [])

  // Get tasks by contact ID
  const getTasksByContact = (contactId: string): Task[] => {
    return tasks.filter(task => task.contact_id === contactId)
  }

  // Create new task
  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    try {
      if (usingFallback || !import.meta.env.VITE_SUPABASE_URL) {
        // Create task locally for fallback mode
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setTasks(prev => [newTask, ...prev])
        return newTask
      }

      const { data, error } = await supabase
        .from('crm_tasks')
        .insert([{
          contact_id: taskData.contact_id,
          title: taskData.title,
          status: taskData.status,
          due_date: taskData.due_date,
          notes: taskData.notes
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ [CRM Tasks] Create error:', error.message)
        throw error
      }

      const newTask: Task = {
        id: data.id,
        contact_id: data.contact_id,
        title: data.title,
        status: data.status,
        due_date: data.due_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
        notes: data.notes
      }

      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      })
      throw error
    }
  }

  // Update task
  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    try {
      if (usingFallback || !import.meta.env.VITE_SUPABASE_URL) {
        // Update task locally for fallback mode
        setTasks(prev => prev.map(task => 
          task.id === id 
            ? { ...task, ...updates, updated_at: new Date().toISOString() }
            : task
        ))
        return
      }

      const { error } = await supabase
        .from('crm_tasks')
        .update({
          title: updates.title,
          status: updates.status,
          due_date: updates.due_date,
          notes: updates.notes
        })
        .eq('id', id)

      if (error) {
        console.error('❌ [CRM Tasks] Update error:', error.message)
        throw error
      }

      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive'
      })
      throw error
    }
  }

  // Delete task
  const deleteTask = async (id: string): Promise<void> => {
    try {
      if (usingFallback || !import.meta.env.VITE_SUPABASE_URL) {
        // Delete task locally for fallback mode
        setTasks(prev => prev.filter(task => task.id !== id))
        return
      }

      const { error } = await supabase
        .from('crm_tasks')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ [CRM Tasks] Delete error:', error.message)
        throw error
      }

      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    tasks,
    loading,
    usingFallback,
    getTasksByContact,
    createTask,
    updateTask,
    deleteTask,
    loadTasks
  }
}