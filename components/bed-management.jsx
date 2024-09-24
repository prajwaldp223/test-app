'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { BedIcon, DollarSign, Clock, Clipboard, ChevronDown, ChevronUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BedManagementJsx() {
  const [beds, setBeds] = useState([
    { id: 1, type: "General", total: 100, available: 30, price: 200, checkInTime: "2:00 PM", additionalDetails: "Standard amenities, shared bathroom" },
    { id: 2, type: "ICU", total: 20, available: 5, price: 1000, checkInTime: "Immediate", additionalDetails: "24/7 monitoring, specialized equipment" },
    { id: 3, type: "Emergency", total: 10, available: 2, price: 500, checkInTime: "Immediate", additionalDetails: "Rapid response team, triage priority" },
    { id: 4, type: "Pediatric", total: 30, available: 10, price: 300, checkInTime: "1:00 PM", additionalDetails: "Child-friendly environment, parent accommodation" },
    { id: 5, type: "Maternity", total: 25, available: 8, price: 400, checkInTime: "12:00 PM", additionalDetails: "Labor and delivery support, newborn care" },
  ])

  const [selectedBedType, setSelectedBedType] = useState("General")
  const [availableBeds, setAvailableBeds] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [showPriceDetails, setShowPriceDetails] = useState(false)
  const [selectedBed, setSelectedBed] = useState(null)
  const [selectedPriceBedType, setSelectedPriceBedType] = useState("General")
  const { toast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedBeds = beds.map((bed) => {
      if (bed.type === selectedBedType) {
        return { ...bed, available: parseInt(availableBeds) }
      }
      return bed
    })
    setBeds(updatedBeds)
    setAvailableBeds("")
    toast({
      title: "Bed availability updated",
      description: `${selectedBedType} beds availability has been updated to ${availableBeds}`,
    })
  }

  const getBedColor = (type) => {
    switch (type) {
      case "General":
        return "text-blue-500"
      case "ICU":
        return "text-red-500"
      case "Emergency":
        return "text-yellow-500"
      case "Pediatric":
        return "text-green-500"
      case "Maternity":
        return "text-pink-500"
      default:
        return "text-gray-500"
    }
  }

  const filteredBeds = activeCategory === "All" ? beds : beds.filter(bed => bed.type === activeCategory)

  const handleBookBed = () => {
    if (selectedBed) {
      const updatedBeds = beds.map((bed) => {
        if (bed.type === selectedBed.type) {
          return { ...bed, available: bed.available - 1 }
        }
        return bed
      })
      setBeds(updatedBeds)
      toast({
        title: "Bed Booked",
        description: `You have successfully booked ${selectedBed.type} bed number ${selectedBed.number}.`,
      })
      setSelectedBed(null)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Hospital Bed Management System</h1>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Update Bed Availability</h2>
          
          <div className="space-y-2">
            <Label htmlFor="bed-type">Bed Type</Label>
            <Select
              value={selectedBedType}
              onValueChange={(value) => setSelectedBedType(value)}
            >
              <SelectTrigger id="bed-type">
                <SelectValue placeholder="Select bed type" />
              </SelectTrigger>
              <SelectContent>
                {beds.map((bed) => (
                  <SelectItem key={bed.id} value={bed.type}>
                    {bed.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="available-beds">Available Beds</Label>
            <Input
              id="available-beds"
              type="number"
              value={availableBeds}
              onChange={(e) => setAvailableBeds(e.target.value)}
              min="0"
              max={beds.find((bed) => bed.type === selectedBedType)?.total}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Update Availability
          </Button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Bed Status</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bed Type</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beds.map((bed) => (
                <TableRow key={bed.id}>
                  <TableCell>{bed.type}</TableCell>
                  <TableCell className="text-right">{bed.total}</TableCell>
                  <TableCell className="text-right">{bed.available}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Bed Occupancy Visualization</h2>
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value)}>
          <TabsList className="mb-4">
            <TabsTrigger value="All">All</TabsTrigger>
            {beds.map((bed) => (
              <TabsTrigger key={bed.id} value={bed.type}>
                {bed.type}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeCategory}>
            {filteredBeds.map((bed) => (
              <div key={bed.id} className="mb-6">
                <h3 className="text-lg font-medium mb-2">{bed.type} Beds</h3>
                <div className="grid grid-cols-10 gap-2">
                  {Array.from({ length: bed.total }, (_, i) => (
                    <Dialog key={i}>
                      <DialogTrigger asChild>
                        <button
                          className={`flex items-center justify-center p-2 rounded-md ${
                            i < bed.available ? "bg-green-100 hover:bg-green-200" : "bg-red-100 cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (i < bed.available) {
                              setSelectedBed({ type: bed.type, number: i + 1 })
                            }
                          }}
                          disabled={i >= bed.available}
                          title={`${bed.type} Bed ${i + 1}: ${i < bed.available ? "Available" : "Occupied"}`}
                        >
                          <BedIcon className={`h-6 w-6 ${getBedColor(bed.type)}`} />
                          <span className="sr-only">
                            {`${bed.type} Bed ${i + 1}: ${i < bed.available ? "Available" : "Occupied"}`}
                          </span>
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book {bed.type} Bed</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to book {bed.type} bed number {i + 1}?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button onClick={handleBookBed}>Confirm Booking</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Available: {bed.available} | Occupied: {bed.total - bed.available}
                </p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bed Category Details</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="bed-type-price" className="text-sm">Bed Type</Label>
              <Select
                value={selectedPriceBedType}
                onValueChange={(value) => setSelectedPriceBedType(value)}
              >
                <SelectTrigger id="bed-type-price" className="w-[180px]">
                  <SelectValue placeholder="Select bed type" />
                </SelectTrigger>
                <SelectContent>
                  {beds.map((bed) => (
                    <SelectItem key={bed.id} value={bed.type}>
                      {bed.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="show-price-details" className="text-sm">Show Price Details</Label>
              <Switch
                id="show-price-details"
                checked={showPriceDetails}
                onCheckedChange={setShowPriceDetails}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {beds
            .filter((bed) => bed.type === selectedPriceBedType)
            .map((bed) => (
              <Card key={bed.id}>
                <CardHeader>
                  <CardTitle>{bed.type} Bed</CardTitle>
                  <CardDescription>Detailed information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                      <span className="font-semibold">Price:</span>
                      <span className="ml-2">${bed.price} per night</span>
                    </div>
                    {showPriceDetails && (
                      <div className="pl-6 text-sm text-gray-600">
                        <p>Daily rate: ${bed.price}</p>
                        <p>Weekly rate: ${bed.price * 7 * 0.9} (10% discount)</p>
                        <p>Monthly rate: ${bed.price * 30 * 0.8} (20% discount)</p>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 opacity-70" />
                      <span className="font-semibold">Check-in Time:</span>
                      <span className="ml-2">{bed.checkInTime}</span>
                    </div>
                    <div className="flex items-start">
                      <Clipboard className="mr-2 h-4 w-4 opacity-70 mt-1" />
                      <div>
                        <span className="font-semibold">Additional Details:</span>
                        <p className="text-sm text-gray-600">{bed.additionalDetails}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}