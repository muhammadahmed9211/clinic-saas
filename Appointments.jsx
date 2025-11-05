import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, X } from 'lucide-react';
import { useAuthStore, useNotificationStore } from '../../store';
import { api } from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Loading from '../ui/Loading';
import Badge from '../ui/Badge';
import { format } from 'date-fns';

const Appointments = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);
  
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);
  
  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments(user.id);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDoctors = async () => {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };
  
  const fetchAvailableSlots = async () => {
    try {
      const data = await api.getAvailableSlots(selectedDoctor, selectedDate);
      setAvailableSlots(data);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    }
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      addNotification({
        type: 'error',
        message: 'Please fill all fields',
      });
      return;
    }
    
    setBookingLoading(true);
    
    try {
      await api.createAppointment({
        user_id: user.id,
        doctor_id: selectedDoctor,
        date: selectedDate,
        time_slot: selectedSlot,
        status: 'pending',
      });
      
      addNotification({
        type: 'success',
        message: 'Appointment booked successfully!',
      });
      
      setShowBookModal(false);
      fetchAppointments();
      resetForm();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to book appointment',
      });
    } finally {
      setBookingLoading(false);
    }
  };
  
  const resetForm = () => {
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedSlot('');
    setAvailableSlots([]);
  };
  
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      await api.cancelAppointment(appointmentId);
      addNotification({
        type: 'success',
        message: 'Appointment cancelled',
      });
      fetchAppointments();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to cancel appointment',
      });
    }
  };
  
  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'info';
  };
  
  if (loading) {
    return <Loading fullScreen text="Loading appointments..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">View and manage your appointments</p>
          </div>
          <Button icon={Plus} onClick={() => setShowBookModal(true)}>
            Book Appointment
          </Button>
        </div>
        
        {/* Appointments List */}
        <div className="grid gap-6">
          {appointments.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
                <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
                <Button onClick={() => setShowBookModal(true)}>Book Now</Button>
              </div>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {appointment.doctor_name}
                      </h3>
                      <p className="text-gray-600">{appointment.specialization}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(appointment.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time_slot}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadge(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    {appointment.status === 'pending' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        
        {/* Book Appointment Modal */}
        <Modal
          isOpen={showBookModal}
          onClose={() => {
            setShowBookModal(false);
            resetForm();
          }}
          title="Book New Appointment"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="input"
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              type="date"
              label="Select Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
            
            {availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSlot === slot
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowBookModal(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookAppointment}
                loading={bookingLoading}
                disabled={!selectedDoctor || !selectedDate || !selectedSlot}
                className="flex-1"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;