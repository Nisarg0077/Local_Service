import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CheckCircle, MapPin, Calendar, Clock, CreditCard, ChevronRight, Shield } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { formatCurrency, formatDate } from '../utils';
import { TIME_SLOTS } from '../constants';
import toast from 'react-hot-toast';
import { bookingsAPI } from '../services/api';
import axios from 'axios';

const STEPS = ['Details', 'Payment', 'Confirmed'];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR', icon: '📱' },
  { id: 'card', label: 'Debit/Credit Card', icon: '💳' },
  { id: 'cod', label: 'Pay After Service', icon: '💵' },
];

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const service = location.state?.service;
  // console.log("Service: ",service)
  const provider = location.state?.provider;
  // console.log("provider: ",provider.map(p => p.id))

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const [details, setDetails] = useState({
    date: new Date(Date.now() + 86400000), // tomorrow
    time: TIME_SLOTS[2],
    address: user?.address || '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [errors, setErrors] = useState({});

  const tax = service.price * 0.18;
  const total = service.price + tax;

  useEffect(() => {
    setBookingId(`B-${Math.floor(10000 + Math.random() * 90000)}`)
  }, [])

  const validateDetails = () => {
    const errs = {};
    if (!details.address.trim()) errs.address = 'Service address is required';
    if (!details.time) errs.time = 'Please select a time slot';
    return errs;
  };

  const handleProceed = () => {
    const errs = validateDetails();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const bookingData = {
        bookingId,
        customerId: user?.uid,
        providerId: service?.providerId,
        serviceId: service?.id,
        date: details.date.toISOString(),
        time: details.time,
        address: details.address,
        note: details.note,
        amount: Math.round(total),
      };
      // console.log(bookingData)

      const res = await bookingsAPI.create(bookingData);

      if (res.data && res.data._id) {
        setBookingId(res.data._id.slice(-6).toUpperCase());
      }

      setStep(3);

      toast.success('Booking confirmed successfully! 🎉', { duration: 4000 });

    } catch (err) {
      toast.error('Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link to="/services" className="hover:text-primary">Services</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Book {service.title}</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8 relative">
          <div className="absolute top-5 left-[16.67%] right-[16.67%] h-0.5 bg-slate-200 dark:bg-slate-700 -z-10">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />
          </div>
          {STEPS.map((label, i) => {
            const s = i + 1;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-900 transition-all duration-300 shadow-sm ${step > s ? 'bg-success text-white' : step === s ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span className={`text-xs font-semibold ${step >= s ? 'text-primary' : 'text-slate-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden">

          {/* ── STEP 1: BOOKING DETAILS ── */}
          {step === 1 && (
            <div className="p-6 sm:p-8 animate-fade-in">
              <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-6">Select Details</h2>

              {/* Service Summary */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl mb-6">
                {service.image ? (
                  <img src={service.image.startsWith('http') ? service.image : `http://localhost:3000${service.image}`} alt={service.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">🏠</div>
                )}
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{service.title}</p>
                  {/* <p className="text-sm text-slate-500 dark:text-slate-400">by {provider.name}</p> */}
                  <p className="text-primary font-bold">{formatCurrency(service.price)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />Service Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={details.date}
                    onChange={(d) => setDetails(p => ({ ...p, date: d }))}
                    minDate={new Date()}
                    dateFormat="dd MMM yyyy"
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm dark:bg-slate-700 dark:text-white"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />Time Slot <span className="text-danger">*</span>
                  </label>
                  <select
                    value={details.time}
                    onChange={e => { setDetails(p => ({ ...p, time: e.target.value })); setErrors(err => ({ ...err, time: '' })); }}
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm dark:bg-slate-700 dark:text-white"
                  >
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {errors.time && <p className="text-danger text-xs mt-1">{errors.time}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />Service Address <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={details.address}
                    onChange={e => { setDetails(p => ({ ...p, address: e.target.value })); setErrors(err => ({ ...err, address: '' })); }}
                    placeholder="Enter your full address with landmark..."
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 ${errors.address ? 'border-danger' : 'border-slate-300 dark:border-slate-600'}`}
                  />
                  {errors.address && <p className="text-danger text-xs mt-1">{errors.address}</p>}
                </div>

                {/* Note */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Special Instructions (optional)</label>
                  <input
                    type="text"
                    value={details.note}
                    onChange={e => setDetails(p => ({ ...p, note: e.target.value }))}
                    placeholder="E.g. Ring bell, pet at home, etc."
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button onClick={handleProceed} size="lg">
                  Proceed to Payment <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === 2 && (
            <div className="p-6 sm:p-8 animate-fade-in">
              <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-6">Payment</h2>

              {/* Order Summary */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-5 mb-6 space-y-3">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider mb-4">Order Summary</h3>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>{service.title}</span>
                  <span className="font-semibold">{formatCurrency(service.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(Math.round(tax))}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Date & Time</span>
                  <span>{formatDate(details.date.toISOString())} at {details.time}</span>
                </div>
                <hr className="border-slate-200 dark:border-slate-600" />
                <div className="flex justify-between font-bold text-lg text-slate-800 dark:text-white pt-1">
                  <span>Total Payable</span>
                  <span className="text-primary">{formatCurrency(Math.round(total))}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Choose Payment Method</p>
                <div className="grid gap-3">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="sr-only" />
                      <span className="text-2xl">{pm.icon}</span>
                      <span className={`font-semibold text-sm ${paymentMethod === pm.id ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{pm.label}</span>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === pm.id ? 'border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                        {paymentMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <Shield className="w-4 h-4 text-success" />
                Your payment is 100% secured with 256-bit SSL encryption
              </div>

              <form onSubmit={handlePayment}>
                <div className="flex justify-between gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>← Back</Button>
                  <Button type="submit" isLoading={isLoading} size="lg" className="flex-1">
                    Confirm & Pay {formatCurrency(Math.round(total))}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 3: CONFIRMATION ── */}
          {step === 3 && (
            <div className="p-8 sm:p-12 animate-fade-in text-center">
              <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-14 h-14 text-success" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-800 dark:text-white mb-3">
                Booking Confirmed! 🎉
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                Your booking ID is <span className="font-bold text-primary">{bookingId}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                <b>{/*provider.name*/}</b> will arrive on <b>{formatDate(details.date.toISOString())}</b> at <b>{details.time}</b>. You'll receive a confirmation SMS shortly.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8 text-sm">
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-left">
                  <p className="text-slate-500 text-xs">Service</p>
                  <p className="font-bold text-slate-800 dark:text-white text-xs leading-tight">{service.title}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-left">
                  <p className="text-slate-500 text-xs">Amount Paid</p>
                  <p className="font-bold text-primary">{formatCurrency(Math.round(total))}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <Link to="/user/dashboard" className="flex-1">
                  <Button variant="outline" fullWidth>View Dashboard</Button>
                </Link>
                <Button onClick={() => navigate('/services')} fullWidth>Book Another</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
