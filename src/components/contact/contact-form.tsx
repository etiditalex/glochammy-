"use client";

import { ButtonPush } from "@/components/ui/button-push";
import { type FormEvent, useState } from "react";

type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SUBJECT_OPTIONS: { value: string; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "order", label: "Order, delivery, or returns" },
  { value: "product", label: "Product information" },
  { value: "salon", label: "Salon or nails booking" },
  { value: "feedback", label: "Feedback or complaint" },
  { value: "other", label: "Other" },
];

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!emailRe.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!values.subject.trim())
    errors.subject = "Please select a topic.";
  if (!values.message.trim()) errors.message = "Tell us how we can help.";
  return errors;
}

const initial: ContactValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const fieldClass =
  "mt-2 w-full border border-line bg-white px-4 py-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const labelClass =
  "block text-sm font-normal text-ink";

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(initial);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  function update<K extends keyof ContactValues>(
    key: K,
    value: ContactValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="font-sans text-base leading-[1.65] text-ink" role="status">
        Thanks for writing in. We typically reply within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 font-sans" noValidate>
      <p className="text-sm leading-[1.6] text-ink">
        Please fill all fields.
      </p>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject
        </label>
        <div className="relative mt-2">
          <select
            id="contact-subject"
            name="subject"
            value={values.subject}
            onChange={(e) => update("subject", e.target.value)}
            aria-invalid={errors.subject ? true : undefined}
            className={`${fieldClass} appearance-none pr-10`}
          >
            <option value="">Please select</option>
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink/70"
            aria-hidden
          >
            ⌄
          </span>
        </div>
        {errors.subject ? (
          <p className="mt-2 text-sm text-red-700">{errors.subject}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className={fieldClass}
          aria-invalid={errors.name ? true : undefined}
        />
        {errors.name ? (
          <p className="mt-2 text-sm text-red-700">{errors.name}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          className={fieldClass}
          aria-invalid={errors.email ? true : undefined}
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-red-700">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${fieldClass} resize-y`}
          aria-invalid={errors.message ? true : undefined}
        />
        {errors.message ? (
          <p className="mt-2 text-sm text-red-700">{errors.message}</p>
        ) : null}
      </div>

      <ButtonPush
        type="submit"
        variant="secondary"
        className="mt-2 w-full !border-accent text-ink hover:bg-ink hover:text-white sm:w-auto"
      >
        Send message
      </ButtonPush>
    </form>
  );
}
