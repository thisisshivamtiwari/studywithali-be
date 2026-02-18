import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
}, { _id: false });

const PhoneSchema = new mongoose.Schema({
    country: { type: String, default: "United Kingdom" },
    countryCode: { type: String, default: "+44" },
    number: { type: String, required: true }
}, { _id: false });

const UrgentContactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    relationship: { type: String },
    address: AddressSchema,
    phone: { type: PhoneSchema, required: true },
    email: { type: String }
}, { _id: false });

const EducationSchema = new mongoose.Schema({
    currentSchool: { type: String },
    currentYear: { type: String },
    religion: { type: String }
}, { _id: false });

const ApplicationSchema = new mongoose.Schema({
    // Personal Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },

    dateOfBirth: { type: Date },

    phone: PhoneSchema,

    // Address
    address: AddressSchema,

    // Emergency Contact
    urgentContact: UrgentContactSchema,

    // Education
    education: EducationSchema,

    // Tuition Subjects
    tuitionSubjects: [{
        type: String
    }],

    // Agreement
    agreedToTerms: {
        type: Boolean,
        required: true
    }

}, {
    timestamps: true,
    versionKey: false
});

const admissionFormModel = mongoose.model("admissionForms", ApplicationSchema, "admissionForms");
export default admissionFormModel;