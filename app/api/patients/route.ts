import { db } from "@/lib/db/db";
import { patients, NewPatient} from "@/lib/db/schema";
import { eq } from "drizzle-orm"; // TODO: What is this
import { NextRequest, NextResponse } from "next/server";

// GET all patients
export async function GET(){
    try{
        const allPatients = await db.select().from(patients).orderBy(patients.createdAt); // Maybe need to count backwards
        return NextResponse.json(allPatients, { status: 200 });
    }
    catch(error){
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
    }
}

// POST /api/patients
export async function POST(request: NextRequest) {    
    try{
        const body = await request.json();
        const newPatient = await db.insert(patients).values(body).returning();
        return NextResponse.json(newPatient[0], { status: 201 });
    }
    catch(error){
        console.error("Error creating patient:", error);
        return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
    }
}