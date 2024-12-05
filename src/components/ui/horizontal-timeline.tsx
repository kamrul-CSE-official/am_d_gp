import React from 'react'
import { cn } from "@/lib/utils"

export interface TimelineItem {
  title: string
  description: string
}

interface HorizontalTimelineProps {
  items: TimelineItem[]
  currentStep: number
}

export function HorizontalTimeline({ items, currentStep }: HorizontalTimelineProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex items-start min-w-full p-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center mx-4 relative">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                index <= currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {index + 1}
            </div>
            <div className={cn(
              "h-1 w-full absolute top-4 left-1/2 -z-10",
              index < items.length - 1 ? "block" : "hidden",
              index < currentStep ? "bg-primary" : "bg-secondary"
            )} />
            <div className="mt-3 text-center">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

