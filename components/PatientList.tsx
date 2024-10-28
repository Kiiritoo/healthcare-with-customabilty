"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient } from "@/types/appwrite.types";
import { Button } from "./ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { getPatientMedicalHistory } from "@/lib/actions/patient.actions";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { StatusBadge } from "./StatusBadge";

// Add these types
interface Appointment {
  $id: string;
  schedule: string;
  status: string;
  primaryPhysician: string;
  cancellationReason?: string;
}

interface MedicalHistory {
  allergies: string;
  currentMedication: string;
  familyMedicalHistory: string;
  pastMedicalHistory: string;
}

export const PatientList = ({ patients }: { patients: { documents: Patient[] } }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeSheet, setActiveSheet] = useState<'medical' | 'appointments' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Group patients by email to remove duplicates
  const uniquePatients = patients?.documents.reduce((acc: any, patient: Patient) => {
    if (!acc[patient.email]) {
      acc[patient.email] = {
        ...patient
      };
    }
    return acc;
  }, {});

  const filteredPatients = Object.values(uniquePatients || {}).filter((patient: any) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewMedicalHistory = async (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveSheet('medical');
    const history = await getPatientMedicalHistory(patient.$id);
    setMedicalHistory(history);
  };

  const viewAppointments = async (patient: Patient) => {
    setIsLoading(true);
    setSelectedPatient(patient);
    setActiveSheet('appointments');
    
    try {
      const appointmentList = await getPatientAppointments(patient.$id);
      
      if (appointmentList?.documents && Array.isArray(appointmentList.documents)) {
        const sortedAppointments = appointmentList.documents
          .filter((apt): apt is Appointment => Boolean(apt)) // Type guard
          .sort((a, b) => 
            new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
          );
        setAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetClose = () => {
    setSelectedPatient(null);
    setActiveSheet(null);
    setMedicalHistory(null);
    setAppointments([]);
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search patients by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      <div className="data-table">
        <Table>
          <TableHeader>
            <TableRow className="shad-table-row-header">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient: any) => (
              <TableRow key={patient.$id} className="shad-table-row">
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>
                  {formatDateTime(patient.$createdAt).dateOnly}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => viewMedicalHistory(patient)}
                    >
                      Medical History
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => viewAppointments(patient)}
                    >
                      View Appointments
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedPatient} onOpenChange={handleSheetClose}>
        <SheetContent className="bg-dark-400 border-dark-500">
          <SheetHeader>
            <SheetTitle className="text-light-200">
              {activeSheet === 'medical' ? 'Medical History' : 'Appointment History'} - {selectedPatient?.name}
            </SheetTitle>
          </SheetHeader>
          
          {activeSheet === 'medical' && medicalHistory && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-16-semibold mb-2">Allergies</h3>
                <p className="text-dark-700">{medicalHistory.allergies || "None"}</p>
              </div>
              
              <div>
                <h3 className="text-16-semibold mb-2">Current Medication</h3>
                <p className="text-dark-700">{medicalHistory.currentMedication || "None"}</p>
              </div>
              
              <div>
                <h3 className="text-16-semibold mb-2">Family Medical History</h3>
                <p className="text-dark-700">{medicalHistory.familyMedicalHistory || "None"}</p>
              </div>
              
              <div>
                <h3 className="text-16-semibold mb-2">Past Medical History</h3>
                <p className="text-dark-700">{medicalHistory.pastMedicalHistory || "None"}</p>
              </div>
            </div>
          )}

          {activeSheet === 'appointments' && (
            <div className="mt-6 space-y-4">
              {isLoading ? (
                <p className="text-dark-700">Loading appointments...</p>
              ) : (
                <>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <div
                        key={appointment.$id}
                        className="p-4 rounded-lg border border-dark-500 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-16-semibold">
                              Dr. {appointment.primaryPhysician}
                            </h3>
                            <p className="text-sm text-dark-700">
                              {formatDateTime(appointment.schedule).dateTime}
                            </p>
                          </div>
                          <StatusBadge status={appointment.status} />
                        </div>
                        {appointment.cancellationReason && (
                          <p className="text-sm text-red-500">
                            Cancellation reason: {appointment.cancellationReason}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-dark-700">No appointments found</p>
                  )}
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
