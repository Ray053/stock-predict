"use client"

import * as React from "react"
import * as CarouselPrimitive from "vaul-carousel"

import { cn } from "@/lib/utils"

const Carousel = CarouselPrimitive.Root

const CarouselItem = React.forwardRef<
  React.ElementRef<typeof CarouselPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CarouselPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CarouselPrimitive.Item
    ref={ref}
    className={cn("-mr-1 rounded-md p-1", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselContent = React.forwardRef<
  React.ElementRef<typeof CarouselPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CarouselPrimitive.Content>
>(({ className, ...props }, ref) => (
  <CarouselPrimitive.Content
    ref={ref}
    className={cn(
      "flex snap-x overflow-auto scroll-smooth pb-2 pt-2",
      className
    )}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

const CarouselPrevious = React.forwardRef<
  React.ElementRef<typeof CarouselPrimitive.Previous>,
  React.ComponentPropsWithoutRef<typeof CarouselPrimitive.Previous>
>(({ className, ...props }, ref) => (
  <CarouselPrimitive.Previous
    ref={ref}
    className={cn(
      "absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md ring-offset-background transition-transform hover:scale-105 disabled:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
CarouselPrevious.displayName = CarouselPrimitive.Previous.displayName

const CarouselNext = React.forwardRef<
  React.ElementRef<typeof CarouselPrimitive.Next>,
  React.ComponentPropsWithoutRef<typeof CarouselPrimitive.Next>
>(({ className, ...props }, ref) => (
  <CarouselPrimitive.Next
    ref={ref}
    className={cn(
      "absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background shadow-md ring-offset-background transition-transform hover:scale-105 disabled:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
CarouselNext.displayName = CarouselPrimitive.Next.displayName

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
