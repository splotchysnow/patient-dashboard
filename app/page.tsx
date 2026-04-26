"use client"

import { useEffect, useState, useRef} from "react"
import { Patient } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LayoutGrid, Table2, Plus } from "lucide-react"
import PatientTable from "@/components/PatientTable"
import PatientBoard from "@/components/PatientBoard"
import PatientDrawer from "@/components/PatientDrawer"
import PatientHeader from "@/components/PatientHeader"

const STATUSES = ["All", "Inquiry", "Onboarding", "Active", "Churned"]

const STATUS_COLORS: Record<string, string> = {
  Inquiry: "bg-yellow-100 text-yellow-800",
  Onboarding: "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Churned: "bg-gray-100 text-gray-800",
}

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [view, setView] = useState<"table" | "board">("table")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  const [recentlyMovedKanban, setRecentlyMovedKanban] = useState<Set<number>>(new Set()) // Store the ID of the recently moved patient for visual feedback

  // Implementing sorting function here: state <> (default)
  const [sortField, setSortField] = useState<"firstName" | "lastName" | "dateOfBirth" | "status" | "address">("firstName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [confirmDelete, setConfirmDelete] = useState<number | null> (null) // if number(id) = delete, if null = no delete.

  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load the patients.
  const fetchPatients = async (silent = false) => {
    if (!silent) {
      setLoading(true)
    }
    const res = await fetch("/api/patients")
    const data = await res.json()
    setPatients(data)
    // This line was giving bug because it resets the set after timeout.
    // setRecentlyMovedKanban(new Set()) // Clear recently moved after fetching new data
    if (!silent) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "All" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField] ?? ""
    const bVal = b[sortField] ?? ""
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getCount = (status: string) =>
    status === "All"
      ? patients.length
      : patients.filter((p) => p.status === status).length

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setDrawerOpen(true)
  }

  const handleAdd = () => {
    setEditingPatient(null)
    setDrawerOpen(true)
  }

  const handleDelete = async () => {
    if (confirmDelete === null) return // No delete action if not confirmed
    await fetch(`/api/patients/${confirmDelete}`, { method: "DELETE" })
    setConfirmDelete(null) // Reset
    fetchPatients()
  }

  // Set the delete button and remember the id of the patient to be deleted.
  const handleDeleteConfirm = (id: number) => {
    setConfirmDelete(id); // Set as id of deleted.
  }

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/patients/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setRecentlyMovedKanban(new Set([id]))
    fetchPatients(true)
    
    // Clear any existing timeout before setting a new one
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current)
    }
    moveTimeoutRef.current = setTimeout(() => {
      setRecentlyMovedKanban(new Set())
    }, 3000)
  }

  const handleSave = () => {
    setDrawerOpen(false)
    fetchPatients()
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and track your patients</p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus size={16} />
            Add Patient
          </Button>
        </div>

        <PatientHeader patients={patients} />
        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {status}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                statusFilter === status ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {getCount(status)}
              </span>
            </button>
          ))}
        </div>

        {/* Search and view toggle */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <Input
            placeholder="Search patients by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-white"
          />
          <div className="flex gap-2">
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("table")}
            >
              <Table2 size={16} />
            </Button>
            <Button
              variant={view === "board" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("board")}
            >
              <LayoutGrid size={16} />
            </Button>
          </div>
        </div>

        {/* Views */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading patients...</div>
        ) : view === "table" ? (


          <PatientTable
            patients={sorted}
            statusColors={STATUS_COLORS}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirm}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        ) : (
          <PatientBoard
            patients={filtered}
            statusColors={STATUS_COLORS}
            onEdit={handleEdit}
            onDelete={handleDeleteConfirm}
            onStatusChange={handleStatusChange}
            recentlyMoved={recentlyMovedKanban}
          />
        )}

        {/* Drawer */}
        <PatientDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSave={handleSave}
          patient={editingPatient}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmDelete !== null} onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent> 
          
            <DialogHeader>
              <DialogTitle>
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this patient? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Button variant="outline" onClick={() => setConfirmDelete(null)} className="mt-4 mr-2">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="mt-4">
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </main>
  )
}