"use client"
import React from "react"

import confetti from "canvas-confetti"
import { X } from "lucide-react"
import type { CardComponentProps } from "onborda"
import { useOnborda } from "onborda"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { FatButton } from "./ui/fat-button"

export const TourCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
}) => {
  const { closeOnborda } = useOnborda()

  function handleFinish() {
    closeOnborda()
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } })
  }

  return (
    <Card className="relative min-w-[320px] w-fit max-w-md border border-zinc-200 bg-white/95 shadow-xl backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardDescription className="text-sm text-zinc-500">
              {currentStep + 1} of {totalSteps}
            </CardDescription>
            <CardTitle className="text-lg text-zinc-900 leading-tight">
              <span className="mr-2">{step.icon}</span>
              {step.title}
            </CardTitle>
          </div>
          <FatButton
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-zinc-800"
            aria-label="Close tour"
            onClick={closeOnborda}
          >
            <X size={16} />
          </FatButton>
        </div>
      </CardHeader>

      <CardContent className="text-sm text-zinc-800 leading-relaxed">{step.content}</CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center gap-3">
          {currentStep !== 0 && (
            <FatButton
              variant="outline"
              className="border-zinc-300 text-zinc-800 hover:bg-zinc-100"
              onClick={prevStep}
            >
              Previous
            </FatButton>
          )}

          {currentStep + 1 !== totalSteps && (
            <FatButton
              className="ml-auto bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={nextStep}
            >
              Next
            </FatButton>
          )}

          {currentStep + 1 === totalSteps && (
            <FatButton
              className="ml-auto bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={handleFinish}
            >
              🎉 Finish!
            </FatButton>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
