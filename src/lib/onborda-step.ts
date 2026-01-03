import type { Step } from "onborda"

export const vehicleAvailabilityTour = {
  tour: "vehicleAvailability",
  steps: [
    {
      icon: "🗓️",
      title: "Pick your view",
      content:
        "Toggle between daily, weekly, or monthly modes to see the right availability window.",
      selector: '[data-onborda="availability-view-mode"]',
      side: "bottom",
      showControls: true,
      pointerPadding: 14,
      pointerRadius: 12,
    },
    {
      icon: "🚦",
      title: "Status legend",
      content: "Each color shows a state: Available, Booked, Active Rental, or Maintenance.",
      selector: '[data-onborda="availability-status-legend"]',
      side: "bottom",
      showControls: true,
      pointerPadding: 14,
      pointerRadius: 12,
    },
    {
      icon: "🧭",
      title: "Navigate the calendar",
      content: "Jump to today or move across months with the navigation controls.",
      selector: '[data-onborda="availability-calendar-nav"]',
      side: "bottom",
      showControls: true,
      pointerPadding: 14,
      pointerRadius: 12,
    },
  ],
} satisfies { tour: string; steps: Step[] }
