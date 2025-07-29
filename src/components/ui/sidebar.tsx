"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sidebarDef = {
  variants: {
    state: {
      open: "w-64",
      closed: "w-16",
    },
  },
  defaultVariants: {
    state: "open",
  },
}

const sidebarVariants = cva(
  "flex h-screen flex-col border-r bg-background transition-[width]",
  sidebarDef
)

const SidebarContext = React.createContext<{
  state: "open" | "closed"
  setState: React.Dispatch<React.SetStateAction<"open" | "closed">>
} | null>(null)

function SidebarProvider({
  children,
  defaultState = "open",
}: {
  children: React.ReactNode
  defaultState?: "open" | "closed"
}) {
  const [state, setState] = React.useState<"open" | "closed">(defaultState)
  return (
    <SidebarContext.Provider value={{ state, setState }}>
      {children}
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(sidebarVariants({ state }), className)}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2 p-2", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("relative", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof CollapsibleTrigger> & {
    isActive?: boolean
    tooltip?: {
      children: React.ReactNode
      side?: "top" | "right" | "bottom" | "left"
    }
  }
>(({ className, isActive, tooltip, ...props }, ref) => {
  const { state } = useSidebar()
  const button = (
    <CollapsibleTrigger
      ref={ref}
      className={cn(
        "flex w-full items-center gap-4 rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        { "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground": isActive },
        { "justify-center": state === "closed" },
        className
      )}
      {...props}
    />
  )

  if (state === "closed" && tooltip) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side={tooltip.side || "right"}>
            {tooltip.children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuSub = React.forwardRef<
  React.ElementRef<typeof Collapsible>,
  React.ComponentPropsWithoutRef<typeof Collapsible>
>(({ className, ...props }, ref) => (
  <Collapsible ref={ref} className={cn(className)} {...props} />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubContent = React.forwardRef<
  React.ElementRef<typeof CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsibleContent>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  if (state === "closed") {
    return null
  }

  return (
    <CollapsibleContent
      ref={ref}
      className={cn("ml-4 border-l pl-4", className)}
      {...props}
    />
  )
})
SidebarMenuSubContent.displayName = "SidebarMenuSubContent"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "fixed left-0 top-0 transition-[padding-left]",
        { "pl-64": state === "open", "pl-16": state === "closed" },
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubContent,
  SidebarInset,
  SidebarProvider,
  useSidebar,
}
