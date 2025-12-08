import { LayoutPreferences } from "@/types/config"

import packageJson from "../../package.json"

const currentYear = new Date().getFullYear()

export const APP_CONFIG = {
  name: "EFFI Rental Dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, EFFI Rental Dashboard.`,
  meta: {
    title: "EFFI Rental Dashboard - Rental Management Dashboard",
    description:
      "EFFI Rental Dashboard is a modern rental management dashboard designed to streamline rental operations and enhance user experience.",
  },
}

export const layoutPreferences: LayoutPreferences = {
  defaultOpen: false,
  contentLayout: "full-width",
  variant: "sidebar",
  collapsible: "icon",
  navbarStyle: "sticky",
}
