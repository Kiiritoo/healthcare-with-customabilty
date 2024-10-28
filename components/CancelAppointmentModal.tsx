import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Appointment } from '@/types/appwrite.types';

interface CancelAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const CancelAppointmentModal = ({
  appointment,
  onClose,
  onConfirm
}: CancelAppointmentModalProps) => {
  const [reason, setReason] = useState('');

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Appointment Details:</p>
            <p>Doctor: Dr. {appointment.primaryPhysician}</p>
            <p>Date: {new Date(appointment.schedule).toLocaleString()}</p>
          </div>

          <div>
            <label className="text-sm font-medium">
              Reason for Cancellation
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancellation"
              className="mt-2"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Back
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onConfirm(reason)}
              disabled={!reason}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
