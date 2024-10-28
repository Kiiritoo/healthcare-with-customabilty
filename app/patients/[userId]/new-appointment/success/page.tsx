"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Button } from "@/components/ui/button";
import { Doctors, DoctorType } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import AppointmentPDF from "@/components/AppointmentPDF";

const RequestSuccess = ({ searchParams }: SearchParamProps) => {
  const [appointment, setAppointment] = useState<AppointmentType | null>(null);
  const [doctor, setDoctor] = useState<DoctorType | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const fetchAppointment = async () => {
      const fetchedAppointment = await getAppointment(
        searchParams.appointmentId
      );
      setAppointment(fetchedAppointment);

      const foundDoctor = Doctors.find(
        (doc) => doc.name === fetchedAppointment?.primaryPhysician
      );
      setDoctor(foundDoctor || null);

      if (fetchedAppointment?.schedule) {
        const formatted = formatDateTime(fetchedAppointment.schedule);
        setFormattedDate(formatted.dateTime);
      }
    };

    fetchAppointment();
  }, [searchParams.appointmentId]);

  if (!appointment || !doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <div className="mb-12 space-y-4">
            <h1 className="header">Request Successful</h1>
            <p className="text-dark-700">
              Your appointment request has been sent successfully.
            </p>
          </div>

          <div className="mb-12 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src={doctor.image}
                alt="doctor"
                width={100}
                height={100}
                className="size-12"
              />
              <div>
                <p className="text-lg font-semibold">Dr. {doctor.name}</p>
                <p className="text-sm text-dark-600">{doctor.type}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-dark-600">Appointment Date</p>
              <p className="text-lg font-semibold">{formattedDate}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/patients/${appointment.userId}/dashboard`}>
              <Button className="shad-button_primary w-full">
                View My Dashboard
              </Button>
            </Link>
            <PDFDownloadLink
              document={
                <AppointmentPDF
                  username={appointment.patient.name}
                  doctorName={doctor.name}
                  appointmentDate={formattedDate}
                  patientGender={appointment.patient.gender}
                />
              }
              fileName="appointment_confirmation.pdf"
            >
              {({ blob, url, loading, error }) => (
                <Button
                  className="shad-button_secondary w-full"
                  disabled={loading}
                >
                  {loading ? "Generating PDF..." : "Download PDF Confirmation"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>

          <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default RequestSuccess;
