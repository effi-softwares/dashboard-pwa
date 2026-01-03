import { Onborda, OnbordaProvider } from "onborda"

import { vehicleAvailabilityTour } from "@/app/(dashboard)/(other)/vehicles/[id]/_tours/availability-tour-step"
import { TourCard } from "@/components/tour-card"

function TourProvider({ children }: { children: React.ReactNode }) {
  return (
    <OnbordaProvider>
      <Onborda
        steps={[vehicleAvailabilityTour]}
        showOnborda={false}
        shadowOpacity="0.4"
        cardComponent={TourCard}
        cardTransition={{ duration: 0.3, type: "spring" }}
      >
        {children}
      </Onborda>
    </OnbordaProvider>
  )
}

export default TourProvider
