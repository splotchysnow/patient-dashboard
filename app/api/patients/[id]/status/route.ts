import { db } from "@/lib/db/db"
import { patients } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

type Props = {
  params: Promise<{ id: string }>
}
// Using Patch because only partially the data is replaced / changed.
export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const patientId = parseInt(id, 10)
    const { status } = await request.json()

    if (!["Inquiry", "Onboarding", "Active", "Churned"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await db
      .update(patients)
      .set({ status })
      .where(eq(patients.id, patientId))
      .returning()

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error("Error updating status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}