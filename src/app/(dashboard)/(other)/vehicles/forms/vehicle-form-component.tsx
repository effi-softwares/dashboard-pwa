"use client"

import { useState } from "react"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"

function VehicleFormComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const hideDrawer = () => setIsOpen(false)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={true}>
      <DrawerTrigger asChild>
        <Button>Add Vehicle</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={false} className="h-dvh rounded-none!">
        <div className="max-w-7xl mx-auto flex flex-col h-full w-full">
          <div className="flex items-center justify-between py-4 mb-4 md:mb-0 border-b w-full">
            <DrawerTitle className="">Title</DrawerTitle>
            <Button className="cursor-pointer" variant="ghost" onClick={hideDrawer}>
              <X />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default VehicleFormComponent
