import * as React from "react"

interface AlertProps {
  children: React.ReactNode
  className?: string
}

export function Alert({ children, className = "" }: AlertProps) {
  return (
    <div className={`border-l-4 border-yellow-400 bg-yellow-50 text-yellow-800 p-4 rounded-md ${className}`}>
      {children}
    </div>
  )
}

interface AlertDescriptionProps {
  children: React.ReactNode
}

export function AlertDescription({ children }: AlertDescriptionProps) {
  return <p className="text-sm">{children}</p>
}