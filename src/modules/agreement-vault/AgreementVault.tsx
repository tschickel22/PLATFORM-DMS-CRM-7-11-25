import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

function AgreementVault() {
  return (
    <Routes>
      <Route path="/" element={
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Agreement Vault</CardTitle>
              <CardDescription>Manage your agreements</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Input
                  placeholder="Search agreements..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      } />
    </Routes>
  )
}

export default AgreementVault