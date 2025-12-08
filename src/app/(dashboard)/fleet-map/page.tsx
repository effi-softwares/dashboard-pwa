import GoogleMap from "./_components/google-map"
import Vehicles from "./_components/vehicles"

function FleetMapPage() {
  return (
    <div className="w-full h-dvh">
      <div className="grid grid-cols-3 h-full">
        <div className="col-span-2 h-full w-full">
          <GoogleMap />
        </div>
        <div className="col-span-1 border-l h-full overflow-y-auto">
          <Vehicles />
        </div>
      </div>
    </div>
  )
}

export default FleetMapPage
