export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const DoctorTypes = [
  "Cardiologist",
  "Family Medicine",
  "Internal Medicine",
] as const;

export type DoctorType = (typeof DoctorTypes)[number];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
    type: "Cardiologist" as DoctorType,
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
    type: "Family Medicine" as DoctorType,
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
    type: "Internal Medicine" as DoctorType,
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
    type: "Cardiologist" as DoctorType,
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
    type: "Family Medicine" as DoctorType,
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
    type: "Internal Medicine" as DoctorType,
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
    type: "Cardiologist" as DoctorType,
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
    type: "Family Medicine" as DoctorType,
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
    type: "Internal Medicine" as DoctorType,
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const cancellationReasons = [
  "The doctor is attending to a critical emergency patient.",
  "A surgery is taking longer than initially expected.",
  "The doctor is still making hospital rounds to visit patients.",
  "Another appointment has gone beyond its scheduled time.",
  "There is an unexpectedly high volume of patients needing attention.",
  "The doctor is performing or supervising a complex procedure.",
  "The doctor was called into the hospital unexpectedly for on-call duty.",
  "The doctor is unwell and unable to attend the meeting.",
  "Travel delays or traffic issues are preventing timely arrival.",
  "The doctor is occupied with urgent administrative or paperwork tasks."
];