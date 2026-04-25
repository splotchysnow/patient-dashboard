import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { patients } from "./lib/db/schema"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const client = neon(process.env.DATABASE_URL!)
const db = drizzle(client)

const seedData = [
  { firstName: "Emma", middleName: "Grace", lastName: "Johnson", dateOfBirth: "2018-03-15", status: "Active", address: "123 Maple St, San Diego, CA 92101" },
  { firstName: "Liam", middleName: "James", lastName: "Williams", dateOfBirth: "2019-07-22", status: "Onboarding", address: "456 Oak Ave, Los Angeles, CA 90001" },
  { firstName: "Sophia", middleName: "Marie", lastName: "Brown", dateOfBirth: "2017-11-08", status: "Inquiry", address: "789 Pine Rd, San Francisco, CA 94102" },
  { firstName: "Noah", middleName: "Alexander", lastName: "Davis", dateOfBirth: "2020-01-30", status: "Active", address: "321 Elm St, Sacramento, CA 95814" },
  { firstName: "Olivia", middleName: "Rose", lastName: "Martinez", dateOfBirth: "2016-09-14", status: "Churned", address: "654 Cedar Blvd, San Jose, CA 95101" },
  { firstName: "Ethan", middleName: "Cole", lastName: "Garcia", dateOfBirth: "2021-04-05", status: "Inquiry", address: "987 Birch Ln, Fresno, CA 93701" },
  { firstName: "Ava", middleName: "Lynn", lastName: "Wilson", dateOfBirth: "2018-12-19", status: "Active", address: "147 Walnut Dr, Long Beach, CA 90802" },
  { firstName: "Lucas", middleName: "Thomas", lastName: "Anderson", dateOfBirth: "2019-06-27", status: "Onboarding", address: "258 Spruce Way, Oakland, CA 94601" },
  { firstName: "Mia", middleName: "Claire", lastName: "Taylor", dateOfBirth: "2020-08-11", status: "Churned", address: "369 Willow Ct, Bakersfield, CA 93301" },
  { firstName: "Jackson", middleName: "Ray", lastName: "Moore", dateOfBirth: "2017-02-03", status: "Active", address: "741 Ash Pl, Anaheim, CA 92801" },
]

async function seed() {
  console.log("Seeding database...")
  await db.insert(patients).values(seedData)
  console.log("Done! 10 patients added.")
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})