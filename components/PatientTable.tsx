"use client"

import { Patient } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"

interface Props {
  patients: Patient[]
  statusColors: Record<string, string>
  onEdit: (patient: Patient) => void
  onDelete: (id: number) => void
}

export default function PatientTable({ patients, statusColors, onEdit, onDelete }: Props) {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-20 text-center">
        <p className="text-gray-400 text-lg">No patients found</p>
        <p className="text-gray-300 text-sm mt-1">Add a patient or adjust your filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date of Birth</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Address</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr
              key={patient.id}
              className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                index === patients.length - 1 ? "border-0" : ""
              }`}
            >
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">
                  {patient.firstName} {patient.middleName ? patient.middleName + " " : ""}{patient.lastName}
                </p>
              </td>
              <td className="px-6 py-4 text-gray-600 text-sm">
                {patient.dateOfBirth}
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                  {patient.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                {patient.address}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(patient)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(patient.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}