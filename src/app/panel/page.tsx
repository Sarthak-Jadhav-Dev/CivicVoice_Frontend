"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Menu, Search } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"


interface ReportCardProps {
  issuer: string
  description: string
  imageUrl: string
  status: "resolved" | "not_resolved"
  onResolve: (index: number) => void
  index: number
}

const ReportCard: React.FC<ReportCardProps> = ({ issuer, description, imageUrl, status, onResolve, index }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [geoImage, setGeoImage] = useState<File | null>(null)
  const [geoDescription, setGeoDescription] = useState("")

  const handleSubmit = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      onResolve(index)
    }, 1500)
  }

  return (
    <>
      <motion.div
        whileHover={{ boxShadow: "0px 0px 15px rgba(59,130,246,0.6)" }}
        className="rounded-xl overflow-hidden border bg-white shadow-md relative flex flex-col justify-between w-full"
      >
        <Card className="h-full flex flex-col justify-between">
          <CardContent className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold truncate">{issuer}</h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  status === "resolved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status === "resolved" ? "Resolved" : "Not Resolved"}
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{description}</p>
            <div className="w-full h-24 sm:h-32 relative rounded-md overflow-hidden">
              <Image src={imageUrl} alt="Report Image" fill className="object-cover" />
            </div>
          </CardContent>

          {status === "not_resolved" && (
            <div className="p-2 sm:p-3">
              <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="w-full">
                Resolve Issue
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Resolve Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Resolve Issue</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input type="file" accept="image/*" onChange={(e) => setGeoImage(e.target.files ? e.target.files[0] : null)} />
            <Input placeholder="Enter description" value={geoDescription} onChange={(e) => setGeoDescription(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const AdminPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [reports, setReports] = useState<ReportCardProps[]>([
    { issuer: "John Doe", description: "Pothole in the main street needs fixing.", imageUrl: "/placeholder.png", status: "not_resolved", onResolve: () => {}, index: 0 },
    { issuer: "Jane Smith", description: "Water leakage near my house.", imageUrl: "/placeholder.png", status: "resolved", onResolve: () => {}, index: 1 },
    { issuer: "Alice Johnson", description: "Street light not working for two days.", imageUrl: "/placeholder.png", status: "not_resolved", onResolve: () => {}, index: 2 },
  ])
  const reportsPerPage = 6

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleResolve = (index: number) => {
    setReports((prev) => prev.map((r, i) => i === index ? { ...r, status: "resolved" } : r))
  }

  const filteredReports = reports.filter(
    (report) => report.issuer.toLowerCase().includes(searchQuery.toLowerCase()) || report.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const startIndex = (currentPage - 1) * reportsPerPage
  const currentReports = filteredReports.slice(startIndex, startIndex + reportsPerPage)

  return (
    <>
      <div className="flex h-screen w-full bg-gray-100">
        <motion.aside
          animate={{ width: sidebarOpen ? 240 : 64 }}
          className="h-full bg-white shadow-lg flex flex-col p-4 border-r overflow-hidden fixed lg:relative z-40 lg:z-auto"
        >
          <div className="flex items-center justify-between mb-6">
            {sidebarOpen && <h1 className="font-bold text-lg">Admin</h1>}
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start">{sidebarOpen && "Dashboard"}</Button>
            <Button variant="ghost" className="justify-start">{sidebarOpen && "Users"}</Button>
            <Button variant="ghost" className="justify-start">{sidebarOpen && "Reports"}</Button>
            <Button variant="ghost" className="justify-start">{sidebarOpen && "Settings"}</Button>
          </nav>
        </motion.aside>

        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'ml-0'}`}>
          <div className="flex flex-col gap-4 p-4 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <Select><SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="State" /></SelectTrigger><SelectContent><SelectItem value="ny">New York</SelectItem><SelectItem value="ca">California</SelectItem><SelectItem value="tx">Texas</SelectItem></SelectContent></Select>
                <Select><SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="City" /></SelectTrigger><SelectContent><SelectItem value="nyc">NYC</SelectItem><SelectItem value="la">Los Angeles</SelectItem><SelectItem value="houston">Houston</SelectItem></SelectContent></Select>
                <Select><SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Area" /></SelectTrigger><SelectContent><SelectItem value="north">North</SelectItem><SelectItem value="south">South</SelectItem><SelectItem value="east">East</SelectItem><SelectItem value="west">West</SelectItem></SelectContent></Select>
              </div>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <Select><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Issue Category" /></SelectTrigger><SelectContent><SelectItem value="infra">Infrastructure</SelectItem><SelectItem value="water">Water Supply</SelectItem><SelectItem value="electricity">Electricity</SelectItem><SelectItem value="waste">Waste Management</SelectItem></SelectContent></Select>
              {searchOpen && (<div className="flex items-center gap-2 w-full sm:w-[250px]"><Search className="h-4 w-4 text-gray-500" /><Input placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" /></div>)}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 place-items-center">
              {currentReports.map((report, idx) => (
                <div key={idx} className="w-full max-w-sm">
                  <ReportCard {...report} index={idx} onResolve={handleResolve} />
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Previous</Button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPanel
