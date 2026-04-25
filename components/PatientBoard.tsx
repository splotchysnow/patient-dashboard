"use client"

import { Patient } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  patients: Patient[]
  statusColors: Record<string, string>
  onEdit: (patient: Patient) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: string) => void
}

const STATUSES = ["Inquiry", "Onboarding", "Active", "Churned"]

export default function PatientBoard({ patients, statusColors, onEdit, onDelete, onStatusChange }: Props) {

  const getAdjacentStatus = (currentStatus: string, direction: "left" | "right") => {
    const index = STATUSES.indexOf(currentStatus)
    if (direction === "left") return STATUSES[index - 1] ?? null
    if (direction === "right") return STATUSES[index + 1] ?? null
    return null
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {STATUSES.map((status) => {
        const columnPatients = patients.filter((p) => p.status === status)
        return (
          <div key={status} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Column header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {status}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {columnPatients.length}
              </span>
            </div>

            {/* Patient cards */}
            <div className="p-3 flex flex-col gap-3 min-h-40">
              {columnPatients.length === 0 ? (
                <div className="text-center py-8 text-gray-300 text-sm">
                  No patients
                </div>
              ) : (
                columnPatients.map((patient) => {
                  const canGoLeft = getAdjacentStatus(patient.status, "left") !== null
                  const canGoRight = getAdjacentStatus(patient.status, "right") !== null

                  return (
                    <div
                      key={patient.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {patient.firstName} {patient.middleName ? patient.middleName + " " : ""}{patient.lastName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{patient.dateOfBirth}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{patient.address}</p>

                      <div className="flex gap-1 mt-2 justify-between items-center">
                        {/* Left/Right arrows */}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={!canGoLeft}
                            onClick={() => {
                              const newStatus = getAdjacentStatus(patient.status, "left")
                              if (newStatus) onStatusChange(patient.id, newStatus)
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                          >
                            <ChevronLeft size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={!canGoRight}
                            onClick={() => {
                              const newStatus = getAdjacentStatus(patient.status, "right")
                              if (newStatus) onStatusChange(patient.id, newStatus)
                            }}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                          >
                            <ChevronRight size={13} />
                          </Button>
                        </div>

                        {/* Edit/Delete */}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(patient)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                          >
                            <Pencil size={11} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(patient.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={11} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}