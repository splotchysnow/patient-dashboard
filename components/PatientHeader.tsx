import { Patient } from "@/lib/db/schema"

// Parameter Props: needs an array of patients to calculate.
interface Props{
    patients: Patient[]
}

export default function PatientHeader({ patients }: Props) {
    if (!patients) return null;
    
    const getCount = (status: string) => {
        if (status === "All") return patients.length;
        return patients.filter((p) => p.status === status).length;
    }

    const total = getCount("All");
    const active = getCount("Active");
    const inquiry = getCount("Inquiry");
    const onboarding = getCount("Onboarding");
    const churned = getCount("Churned");

    // Each label should have a name, value and a color.
    const stats = [
        { label: "Total Patients", value: total, color: "bg-gray-100 text-gray-800" },
        { label: "Inquiry", value: inquiry, color: "bg-yellow-100 text-yellow-800" },
        { label: "Onboarding", value: onboarding, color: "bg-blue-100 text-blue-800" },
        { label: "Active", value: active, color: "bg-green-100 text-green-800" },
        { label: "Churned", value: churned, color: "bg-gray-100 text-gray-800" },
    ]

    return (
        <div className="grid grid-cols-5 gap-4 mb-6">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white rounded-xl border border-gray-200 p-4"
                    >
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.color}`}>
                        {stat.label}
                    </span>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
            ))}
        </div>
    )
}