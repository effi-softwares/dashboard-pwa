"use client"
import React, { useEffect, useRef, useState } from "react"

import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Camera,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Edit2,
  FileText,
  Fuel,
  Gauge,
  Info,
  LayoutGrid,
  List,
  LogOut,
  PenTool,
  Plus,
  Search,
  Settings,
  Smartphone,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react"

// --- Mock Data ---
const INITIAL_FLEET = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2023,
    category: "Sedan",
    status: "Available",
    fuel: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=800",
    plate: "ABC-1234",
    pricing: [
      { id: "p1", type: "Daily", price: 45, mileage: { unlimited: false, limit: 200, fee: 0.5 } },
      { id: "p2", type: "Weekly", price: 280, mileage: { unlimited: true, limit: 0, fee: 0 } },
    ],
  },
  {
    id: 2,
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    category: "Electric",
    status: "Rented",
    fuel: "Electric",
    transmission: "Automatic",
    seats: 5,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800",
    plate: "ELC-9988",
    pricing: [
      { id: "p1", type: "Daily", price: 85, mileage: { unlimited: true, limit: 0, fee: 0 } },
      { id: "p2", type: "Monthly", price: 2200, mileage: { unlimited: true, limit: 0, fee: 0 } },
    ],
  },
  {
    id: 3,
    make: "Ford",
    model: "Explorer",
    year: 2022,
    category: "SUV",
    status: "Available",
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 7,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    plate: "SUV-5544",
    pricing: [
      { id: "p1", type: "Daily", price: 70, mileage: { unlimited: true, limit: 0, fee: 0 } },
    ],
  },
]

const INITIAL_BOOKINGS = [
  {
    id: "b1",
    customer: "Alice Johnson",
    vehicleId: 2,
    vehicleName: "Tesla Model 3",
    startDate: "2023-10-15",
    endDate: "2023-11-15",
    status: "Active",
    total: 2200,
  },
  {
    id: "b2",
    customer: "Bob Smith",
    vehicleId: 1,
    vehicleName: "Toyota Camry",
    startDate: "2023-09-01",
    endDate: "2023-09-08",
    status: "Completed",
    total: 280,
  },
]

// --- Helper Functions ---
const getPrimaryRate = vehicle => {
  if (!vehicle.pricing || vehicle.pricing.length === 0) return { price: 0, unit: "" }
  const daily = vehicle.pricing.find(p => p.type === "Daily")
  if (daily) return { price: daily.price, unit: "/day" }
  return {
    price: vehicle.pricing[0].price,
    unit: `/${vehicle.pricing[0].type === "Weekly" ? "wk" : "mo"}`,
  }
}

const formatDate = dateStr => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// --- Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    Available: "bg-green-100 text-green-700 border-green-200",
    Rented: "bg-blue-100 text-blue-700 border-blue-200",
    Maintenance: "bg-amber-100 text-amber-700 border-amber-200",
    Active: "bg-green-100 text-green-700 border-green-200",
    Completed: "bg-gray-100 text-gray-700 border-gray-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  }
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100"}`}
    >
      {status}
    </span>
  )
}

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-0 overflow-y-auto max-h-[85vh]">{children}</div>
      </div>
    </div>
  )
}

const SignaturePad = ({ onEnd }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = 200
      const ctx = canvas.getContext("2d")
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.strokeStyle = "#000000"
    }
  }, [])

  const getPos = e => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDrawing = e => {
    e.preventDefault()
    setIsDrawing(true)
    const ctx = canvasRef.current.getContext("2d")
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = e => {
    if (!isDrawing) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext("2d")
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (onEnd) onEnd(canvasRef.current.toDataURL())
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (onEnd) onEnd(null)
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 relative">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-[200px] cursor-crosshair touch-none"
      />
      <button
        type="button"
        onClick={clear}
        className="absolute top-2 right-2 text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 hover:text-red-600"
      >
        Clear Signature
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-400 pointer-events-none select-none">
        Sign above using mouse or finger
      </div>
    </div>
  )
}

// --- RENTAL WIZARD (Customer Booking Flow) ---
const RentalWizard = ({ vehicle, onComplete, onCancel }) => {
  const [step, setStep] = useState(1)
  const [rentalData, setRentalData] = useState({
    firstName: "",
    lastName: "",
    license: "",
    phone: "",
    email: "",
    images: { front: null, back: null, interior: null, dash: null },
    duration: "1 Week",
    paymentMethod: "Direct Debit",
    iban: "",
    accountName: "",
    signature: null,
  })

  const handleDataChange = (field, value) => {
    setRentalData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = key => {
    setRentalData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [key]: "https://placehold.co/300x200/e2e8f0/64748b?text=Image+Captured",
      },
    }))
  }

  const isStepValid = () => {
    if (step === 1) return rentalData.firstName && rentalData.lastName && rentalData.license
    if (step === 2) return true
    if (step === 3) return rentalData.iban && rentalData.accountName
    if (step === 4) return rentalData.signature
    return false
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Progress Bar */}
      <div className="px-8 py-6 bg-slate-50 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { icon: User, label: "Customer" },
            { icon: Camera, label: "Condition" },
            { icon: CreditCard, label: "Payment" },
            { icon: PenTool, label: "Agreement" },
          ].map((item, idx) => {
            const isActive = step === idx + 1
            const isDone = step > idx + 1
            return (
              <div key={idx} className="flex flex-col items-center relative z-10 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-md scale-110" : isDone ? "bg-green-500 text-white" : "bg-white border-2 border-gray-200 text-gray-400"}`}
                >
                  {isDone ? <CheckCircle size={20} /> : <item.icon size={18} />}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${isActive ? "text-blue-700" : "text-gray-500"}`}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
          <div className="absolute top-11 left-0 right-0 h-0.5 bg-gray-200 -z-0 max-w-2xl mx-auto hidden md:block" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={rentalData.firstName}
                  onChange={e => handleDataChange("firstName", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={rentalData.lastName}
                  onChange={e => handleDataChange("lastName", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver's License #
                </label>
                <input
                  type="text"
                  value={rentalData.license}
                  onChange={e => handleDataChange("license", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={rentalData.phone}
                  onChange={e => handleDataChange("phone", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={rentalData.email}
                onChange={e => handleDataChange("email", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="customer@example.com"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-gray-900">Vehicle Condition Proof</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Vehicle: {vehicle.make} {vehicle.model}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {["front", "back", "interior", "dash"].map(key => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-semibold capitalize text-gray-700">
                    {key} View
                  </label>
                  <div
                    onClick={() => handleImageUpload(key)}
                    className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 relative overflow-hidden ${rentalData.images[key] ? "border-blue-500" : "border-gray-300"}`}
                  >
                    {rentalData.images[key] ? (
                      <img
                        src={rentalData.images[key]}
                        alt={key}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Camera className="text-gray-400 mb-2" size={32} />
                        <span className="text-xs text-gray-500 font-medium">Tap to Capture</span>
                      </>
                    )}
                    {rentalData.images[key] && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-sm">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment & Subscription</h2>
            <div className="bg-slate-900 text-white p-6 rounded-xl flex justify-between items-center mb-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Estimated Weekly Subscription</p>
                <h3 className="text-3xl font-bold">$280.00</h3>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Initial Deposit</p>
                <p className="font-semibold text-xl">$500.00</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50 rounded-xl">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Setup Direct Debit</h4>
                  <p className="text-sm text-blue-700">
                    Recurring payments will be deducted automatically.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={rentalData.accountName}
                    onChange={e => handleDataChange("accountName", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name on account"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Chase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN / Account Number
                </label>
                <input
                  type="text"
                  value={rentalData.iban}
                  onChange={e => handleDataChange("iban", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="US00 0000 0000 0000"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Finalize Agreement</h2>
              <p className="text-gray-500">Please review and sign below to complete the rental.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-48 overflow-y-auto text-xs text-gray-600 mb-6">
              <h4 className="font-bold mb-2">Rental Agreement Terms</h4>
              <p className="mb-2">
                1. The Renter agrees to return the vehicle in the same condition as received...
              </p>
              <p>2. The Renter acknowledges liability for any damage, traffic violations...</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Customer Signature
              </label>
              <SignaturePad onEnd={data => handleDataChange("signature", data)} />
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
              <Smartphone size={20} className="shrink-0 mt-0.5" />
              <p>Pass the device to the customer to sign.</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
        <button
          onClick={() => (step === 1 ? onCancel() : setStep(step - 1))}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white font-medium transition-colors"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>
        <button
          onClick={() => (step === 4 ? onComplete(rentalData) : setStep(step + 1))}
          disabled={!isStepValid()}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {step === 4 ? "Complete Rental" : "Next Step"} {step !== 4 && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  )
}

// --- RESTORED: FULL VEHICLE WIZARD FORM (Admin - Add/Edit Vehicle) ---
const VehicleWizardForm = ({ initialData, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1)
  const [isAddingRate, setIsAddingRate] = useState(false)
  const [formData, setFormData] = useState(
    initialData || {
      // Step 1: Details
      make: "",
      model: "",
      year: new Date().getFullYear(),
      category: "Sedan",
      status: "Available",
      fuel: "Petrol",
      transmission: "Automatic",
      seats: 5,
      plate: "",
      image: "",
      // Step 2: Pricing Array
      pricing: [],
    },
  )

  // Local state for the "Add Rate" sub-form
  const [newRate, setNewRate] = useState({
    type: "Daily",
    price: "",
    mileage: { unlimited: true, limit: 100, fee: 0.5 },
  })

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleAddRate = () => {
    if (!newRate.price) return
    if (formData.pricing.some(p => p.type === newRate.type)) {
      alert(`A ${newRate.type} rate already exists.`)
      return
    }
    const rateEntry = { ...newRate, id: Date.now().toString(), price: parseFloat(newRate.price) }
    setFormData(prev => ({ ...prev, pricing: [...prev.pricing, rateEntry] }))
    setNewRate({ type: "Daily", price: "", mileage: { unlimited: true, limit: 100, fee: 0.5 } })
    setIsAddingRate(false)
  }

  const removeRate = id => {
    setFormData(prev => ({ ...prev, pricing: prev.pricing.filter(p => p.id !== id) }))
  }

  const validateStep1 = () => formData.make && formData.model && formData.plate
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Step Indicator */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </div>
            <span className="text-xs mt-1 font-medium text-gray-600">Details</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </div>
            <span className="text-xs mt-1 font-medium text-gray-600">Pricing</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                <input
                  required
                  type="text"
                  value={formData.make}
                  onChange={e => handleChange("make", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                  placeholder="e.g. Toyota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input
                  required
                  type="text"
                  value={formData.model}
                  onChange={e => handleChange("model", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                  placeholder="e.g. Camry"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  required
                  type="number"
                  value={formData.year}
                  onChange={e => handleChange("year", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate *
                </label>
                <input
                  required
                  type="text"
                  value={formData.plate}
                  onChange={e => handleChange("plate", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                  placeholder="ABC-123"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => handleChange("category", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                >
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Luxury</option>
                  <option>Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  value={formData.fuel}
                  onChange={e => handleChange("fuel", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Hybrid</option>
                  <option>Electric</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={e => handleChange("transmission", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                >
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={e => handleChange("seats", e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={e => handleChange("image", e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2.5 text-sm outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign size={18} className="text-blue-600" /> Pricing Configuration
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage standard rates and mileage limits.
                  </p>
                </div>
                {!isAddingRate && (
                  <button
                    type="button"
                    onClick={() => setIsAddingRate(true)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg shadow-sm"
                  >
                    <Plus size={16} /> Add Rate
                  </button>
                )}
              </div>

              {isAddingRate && (
                <div className="mb-6 p-5 bg-white rounded-xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <h5 className="text-sm font-semibold text-gray-800 mb-4">New Rate Details</h5>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Rate Type
                      </label>
                      <select
                        value={newRate.type}
                        onChange={e => setNewRate({ ...newRate, type: e.target.value })}
                        className="w-full rounded-lg border-slate-300 border p-2.5 text-sm"
                      >
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={newRate.price}
                        onChange={e => setNewRate({ ...newRate, price: e.target.value })}
                        className="w-full rounded-lg border-slate-300 border p-2.5 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-500">Mileage Policy</label>
                      <button
                        type="button"
                        onClick={() =>
                          setNewRate({
                            ...newRate,
                            mileage: { ...newRate.mileage, unlimited: !newRate.mileage.unlimited },
                          })
                        }
                        className="text-xs flex items-center gap-2 text-slate-600"
                      >
                        {newRate.mileage.unlimited ? (
                          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle size={12} /> Unlimited
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertCircle size={12} /> Limited
                          </span>
                        )}
                        <span className="underline">Change</span>
                      </button>
                    </div>
                    {!newRate.mileage.unlimited && (
                      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">
                            Limit (km)
                          </label>
                          <input
                            type="number"
                            value={newRate.mileage.limit}
                            onChange={e =>
                              setNewRate({
                                ...newRate,
                                mileage: { ...newRate.mileage, limit: e.target.value },
                              })
                            }
                            className="w-full rounded border-slate-200 border p-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-400 mb-1">
                            Extra Fee ($/km)
                          </label>
                          <input
                            type="number"
                            value={newRate.mileage.fee}
                            onChange={e =>
                              setNewRate({
                                ...newRate,
                                mileage: { ...newRate.mileage, fee: e.target.value },
                              })
                            }
                            className="w-full rounded border-slate-200 border p-1.5 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingRate(false)}
                      className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddRate}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {formData.pricing.length === 0
                  ? !isAddingRate && (
                      <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-slate-50/50">
                        <p className="text-gray-400 text-sm">No rates configured yet.</p>
                      </div>
                    )
                  : formData.pricing.map(rate => (
                      <div
                        key={rate.id}
                        className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{rate.type}</span>
                            <span className="text-gray-300">|</span>
                            <span className="font-bold text-blue-600">${rate.price}</span>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Gauge size={12} />
                            {rate.mileage.unlimited
                              ? "Unlimited Mileage"
                              : `${rate.mileage.limit}km included • $${rate.mileage.fee}/km overage`}
                          </div>
                        </div>
                        <button
                          onClick={() => removeRate(rate.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          {step === 1 ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => validateStep1() && setStep(2)}
              disabled={!validateStep1()}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              Next Step <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={formData.pricing.length === 0}
              className="px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium shadow-md disabled:opacity-50"
            >
              {initialData ? "Save Changes" : "Create Vehicle"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

// --- Main App Component ---
export default function FleetManager() {
  const [vehicles, setVehicles] = useState(INITIAL_FLEET)
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)

  const [view, setView] = useState("list") // 'list', 'detail', 'rental-flow', 'bookings', 'select-vehicle'
  const [viewMode, setViewMode] = useState("table")
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Filter Logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const availableVehicles = vehicles.filter(v => v.status === "Available")

  // Stats
  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === "Available").length,
    rented: vehicles.filter(v => v.status === "Rented").length,
    maintenance: vehicles.filter(v => v.status === "Maintenance").length,
  }

  // Handlers
  const handleAdd = newVehicle => {
    const vehicle = {
      ...newVehicle,
      id: Date.now(),
      image: newVehicle.image || `https://placehold.co/600x400?text=${newVehicle.make}`,
    }
    setVehicles([vehicle, ...vehicles])
    setIsModalOpen(false)
  }

  const handleUpdate = updatedData => {
    setVehicles(vehicles.map(v => (v.id === editingVehicle.id ? { ...v, ...updatedData } : v)))
    if (selectedVehicle?.id === editingVehicle.id)
      setSelectedVehicle({ ...selectedVehicle, ...updatedData })
    setIsModalOpen(false)
    setEditingVehicle(null)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (confirm("Delete vehicle?")) {
      setVehicles(vehicles.filter(v => v.id !== id))
      setSelectedVehicle(null)
      setView("list")
    }
  }

  const startRentalFlow = vehicle => {
    setSelectedVehicle(vehicle)
    setView("rental-flow")
  }

  const completeRental = rentalData => {
    // 1. Create Booking Record
    const newBooking = {
      id: `b${Date.now()}`,
      customer: `${rentalData.firstName} ${rentalData.lastName}`,
      vehicleId: selectedVehicle.id,
      vehicleName: `${selectedVehicle.make} ${selectedVehicle.model}`,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "Ongoing", // Simplified logic
      status: "Active",
      total: 0, // Would calculate based on duration
    }
    setBookings([newBooking, ...bookings])

    // 2. Update Vehicle Status
    const updatedCar = { ...selectedVehicle, status: "Rented" }
    setVehicles(vehicles.map(v => (v.id === selectedVehicle.id ? updatedCar : v)))

    // 3. Reset View
    setView("bookings")
  }

  // --- Main Render ---
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 z-10 bg-gray-100 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">New Rental</h1>
              <p className="text-sm text-gray-500">
                Processing: {selectedVehicle?.make} {selectedVehicle?.model}
              </p>
            </div>
            <button
              onClick={() => setView("bookings")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <RentalWizard
              vehicle={selectedVehicle}
              onComplete={completeRental}
              onCancel={() => setView("bookings")}
            />
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
      >
        <VehicleWizardForm
          initialData={editingVehicle}
          onSubmit={editingVehicle ? handleUpdate : handleAdd}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
