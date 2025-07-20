@@ .. @@
 import React, { useState } from 'react'
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
 import { Button } from '@/components/ui/button'
 import { Input } from '@/components/ui/input'
 import { Badge } from '@/components/ui/badge'
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
-import { Search, Filter, Edit, ExternalLink, MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react'
+import { Search, Filter, Edit, ExternalLink, MoreHorizontal, Mail, Phone, Calendar, Users } from 'lucide-react'
 import { cn } from '@/lib/utils'
 import { useToast } from '@/hooks/use-toast'
@@ .. @@
   }
 ]
 
-interface PortalUserListProps {
+interface PortalAdminUserListProps {
   onImpersonate: (userId: string, userName: string) => void
 }
 
-export function PortalUserList({ onImpersonate }: PortalUserListProps) {
+export function PortalAdminUserList({ onImpersonate }: PortalAdminUserListProps) {