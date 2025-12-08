import { useEffect, useState } from "react"

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)

    setMatches(mediaQueryList.matches)
    const updateMatches = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQueryList.addEventListener("change", updateMatches)

    return () => {
      mediaQueryList.removeEventListener("change", updateMatches)
    }
  }, [query])

  return matches
}
