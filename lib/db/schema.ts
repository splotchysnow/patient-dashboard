import { pgTable, serial, text, date, timestamp} from "drizzle-orm/pg-core"


// Name (First, Middle, Last)
// Date of Birth
// Status (Maybe make it enum?)
// Address

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export const patients = pgTable("patients",{
    id : serial('id').primaryKey(),
    firstName : text('first_name').notNull(),
    middleName : text('middle_name'), // don't worry about this being Null.
    lastName : text('last_name').notNull(),
    dateOfBirth : date("date_of_birth").notNull(),
    status : text("status").notNull().default("Inquiry"),
    address : text("address").notNull(),
    createdAt : timestamp("created_at").defaultNow().notNull(),
})

