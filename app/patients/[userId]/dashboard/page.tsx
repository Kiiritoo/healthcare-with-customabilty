import { AppointmentList } from "@/components/AppointmentList";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PatientDashboard = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <div className="flex justify-between items-center mb-12">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="logo"
              className="h-10 w-fit"
            />
            <Link href="/">
              <Button variant="outline" className="shad-button_secondary">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mb-12 space-y-4">
            <h1 className="header">My Appointments</h1>
            <p className="text-dark-700">
              View and manage your upcoming appointments
            </p>
          </div>

          <AppointmentList userId={userId} />

          <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
