export type BookingFormValues = {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  notes: string;
};

export type BookingFormErrors = Partial<
  Record<keyof BookingFormValues, string>
>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBooking(values: BookingFormValues): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!emailRe.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter a phone number.";
  } else if (values.phone.replace(/\D/g, "").length < 9) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!values.serviceId) {
    errors.serviceId = "Choose a service.";
  }

  if (!values.date) {
    errors.date = "Select a date.";
  }

  if (!values.time) {
    errors.time = "Select a time.";
  }

  return errors;
}
