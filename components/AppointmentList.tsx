"use client";

import { useState, useEffect } from 'react';
import { Query } from 'appwrite';
import { databases } from '@/lib/appwrite/config';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import { getPatientAppointments, updateAppointment } from '@/lib/actions/appointment.actions';
import { Appointment } from '@/types/appwrite.types';

interface AppointmentListProps {
  userId: string;
}

export const AppointmentList = ({ userId }: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentList = await getPatientAppointments(userId);
      setAppointments(appointmentList?.documents || []);
    };

    fetchAppointments();
  }, [userId]);

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.$id} className="p-4 border rounded-lg bg-dark-400">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Dr. {appointment.primaryPhysician}</h3>
              <p className="text-sm text-gray-400">
                {new Date(appointment.schedule).toLocaleString()}
              </p>
              <p className="text-sm mt-2">
                Status: <span className={`font-medium ${appointment.status === 'scheduled' ? 'text-green-500' : 'text-red-500'}`}>
                  {appointment.status}
                </span>
              </p>
            </div>
            {appointment.status === 'scheduled' && (
              <button
                onClick={() => handleCancelClick(appointment)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancel Appointment
              </button>
            )}
          </div>
        </div>
      ))}

      {showCancelModal && selectedAppointment && (
        <CancelAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowCancelModal(false)}
          onConfirm={async (reason) => {
            await updateAppointment({
              appointmentId: selectedAppointment.$id,
              userId,
              appointment: {
                status: 'cancelled',
                cancellationReason: reason
              },
              type: 'cancel'
            });
            
            // Refresh appointments list
            const updatedAppointments = await getPatientAppointments(userId);
            setAppointments(updatedAppointments?.documents || []);
            setShowCancelModal(false);
          }}
        />
      )}
    </div>
  );
};
