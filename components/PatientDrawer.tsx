"use client"

import { useEffect, useState } from "react"
import { Patient } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  open: boolean
  onClose: () => void
  onSave: () => void
  patient: Patient | null
}

const STATUSES = ["Inquiry", "Onboarding", "Active", "Churned"]

const EMPTY_FORM = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  status: "Inquiry",
  address: "",
}

export default function PatientDrawer({ open, onClose, onSave, patient }: Props) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName,
        middleName: patient.middleName ?? "",
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        status: patient.status,
        address: patient.address,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [patient, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.firstName.trim()) newErrors.firstName = "First name is required"
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!form.address.trim()) newErrors.address = "Address is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (patient) {
        await fetch(`/api/patients/${patient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      onSave()
    } catch (error) {
      console.error("Failed to save patient:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {patient ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Middle Name{" "}
              <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <Input
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
              placeholder="Middle name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Status <span className="text-red-500">*</span>
            </label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Full address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving..." : patient ? "Save Changes" : "Add Patient"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}