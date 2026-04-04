"use client";

import { FadeIn } from "@/components/motion/fade-in";
import { ButtonPush } from "@/components/ui/button-push";
import { salonServices } from "@/lib/data/services";
import {
  type BookingFormValues,
  validateBooking,
} from "@/lib/validators/booking";
import { type FormEvent, useMemo, useState } from "react";

const initial: BookingFormValues = {
  name: "",
  email: "",
  phone: "",
  serviceId: "",
  date: "",
  time: "",
  notes: "",
};

export function BookingForm() {
  const [values, setValues] = useState<BookingFormValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  function update<K extends keyof BookingFormValues>(
    key: K,
    value: BookingFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateBooking(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <FadeIn>
        <p className="text-base leading-relaxed text-muted" role="status">
          Thank you, {values.name.split(" ")[0]}. We&apos;ve received your
          request for{" "}
          <span className="text-ink">
            {salonServices.find((s) => s.id === values.serviceId)?.name}
          </span>{" "}
          on {values.date} at {values.time}. Our team will confirm shortly.
        </p>
      </FadeIn>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 md:grid-cols-2"
      noValidate
    >
      <div className="md:col-span-2">
        <label htmlFor="booking-name" className="text-2xs uppercase tracking-nav text-muted">
          Full name
        </label>
        <input
          id="booking-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="mt-2 w-full border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "booking-name-error" : undefined}
        />
        {errors.name ? (
          <p id="booking-name-error" className="mt-2 text-sm text-red-700">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="booking-email" className="text-2xs uppercase tracking-nav text-muted">
          Email
        </label>
        <input
          id="booking-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          className="mt-2 w-full border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "booking-email-error" : undefined}
        />
        {errors.email ? (
          <p id="booking-email-error" className="mt-2 text-sm text-red-700">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="booking-phone" className="text-2xs uppercase tracking-nav text-muted">
          Phone
        </label>
        <input
          id="booking-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="mt-2 w-full border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "booking-phone-error" : undefined}
        />
        {errors.phone ? (
          <p id="booking-phone-error" className="mt-2 text-sm text-red-700">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="booking-service"
          className="text-2xs uppercase tracking-nav text-muted"
        >
          Service
        </label>
        <select
          id="booking-service"
          name="serviceId"
          value={values.serviceId}
          onChange={(e) => update("serviceId", e.target.value)}
          className="mt-2 w-full border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-invalid={errors.serviceId ? true : undefined}
          aria-describedby={errors.serviceId ? "booking-service-error" : undefined}
        >
          <option value="">Select a service</option>
          {salonServices.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.serviceId ? (
          <p id="booking-service-error" className="mt-2 text-sm text-red-700">
            {errors.serviceId}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="booking-date" className="text-2xs uppercase tracking-nav text-muted">
          Preferred date
        </label>
        <input
          id="booking-date"
          name="date"
          type="date"
          min={minDate}
          value={values.date}
          onChange={(e) => update("date", e.target.value)}
          className="mt-2 w-full border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-invalid={errors.date ? true : undefined}
          aria-describedby={errors.date ? "booking-date-error" : undefined}
        />
        {errors.date ? (
          <p id="booking-date-error" className="mt-2 text-sm text-red-700">
            {errors.date}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="booking-time" className="text-2xs uppercase tracking-nav text-muted">
          Preferred time
        </label>
        <input
          id="booking-time"
          name="time"
          type="time"
          value={values.time}
          onChange={(e) => update("time", e.target.value)}
          className="mt-2 w-full border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-invalid={errors.time ? true : undefined}
          aria-describedby={errors.time ? "booking-time-error" : undefined}
        />
        {errors.time ? (
          <p id="booking-time-error" className="mt-2 text-sm text-red-700">
            {errors.time}
          </p>
        ) : null}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="booking-notes" className="text-2xs uppercase tracking-nav text-muted">
          Notes (optional)
        </label>
        <textarea
          id="booking-notes"
          name="notes"
          rows={4}
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="mt-2 w-full resize-y border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
      </div>

      <div className="md:col-span-2">
        <ButtonPush type="submit">Request appointment</ButtonPush>
      </div>
    </form>
  );
}
