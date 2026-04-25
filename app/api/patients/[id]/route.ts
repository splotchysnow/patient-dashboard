import { db } from "@/lib/db/db";
import { patients} from "@/lib/db/schema";
import { eq } from "drizzle-orm"; // TODO: What is this
import { NextRequest, NextResponse } from "next/server";


// GET /api/patients/:id
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const patientId = parseInt(params.id, 10);
        const [patient] = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        
        return NextResponse.json(patient, { status: 200 });
    } catch (error) {
        console.error("Error fetching patient:", error);
        return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
    }
}

// PUT /api/patients/:id
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const patientId = parseInt(params.id, 10);
        const updatedPatient = await db.update(patients).set(body).where(eq(patients.id, patientId)).returning();
        return NextResponse.json(updatedPatient[0], { status: 200 });
    } catch (error) {
        console.error("Error updating patient:", error);
        return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
    }
}

// DELETE /api/patients/:id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const patientId = parseInt(params.id, 10);
        await db.delete(patients).where(eq(patients.id, patientId));
        return NextResponse.json({ message: "Patient deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting patient:", error);
        return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
    }
}
