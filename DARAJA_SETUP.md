# M-Pesa Daraja Setup (Glochammy Beauty)

This project already uses Safaricom Daraja STK Push for cart checkout in KES.

## Current Architecture

- Frontend checkout starts M-Pesa from `src/components/cart/cart-checkout.tsx`.
- Server action creates order + starts STK push in `src/app/actions/checkout-mpesa.ts`.
- Daraja request logic is in `src/lib/mpesa/daraja.ts` and `src/lib/mpesa/stk-flow.ts`.
- Safaricom callback endpoint is `src/app/api/mpesa/stk-callback/route.ts`.
- Daraja alias callback endpoint is `src/app/api/daraja/callback/route.ts` (for naming parity with other projects).
- Daraja-compatible STK endpoint is `src/app/api/daraja/stk-push/route.ts`.
- Daraja-compatible verify endpoint is `src/app/api/daraja/verify-ref/route.ts`.
- Callback URL resolves to `<NEXT_PUBLIC_SITE_URL>/api/daraja/callback` unless `MPESA_CALLBACK_URL` is set.
- Existing `<NEXT_PUBLIC_SITE_URL>/api/mpesa/stk-callback` still works and points to the same handler.

## Required Environment Variables

- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Required for Auto-Marking Orders as Paid

- `SUPABASE_SERVICE_ROLE_KEY`

Without this key, STK can still be initiated, but callback updates to paid status may be blocked by RLS.

## Optional Production Overrides

- `MPESA_BASE_URL` (`https://sandbox.safaricom.co.ke` or `https://api.safaricom.co.ke`)
- `MPESA_OAUTH_URL` (full OAuth proxy URL; supports URLs with or without `grant_type`)
- `MPESA_STKPUSH_URL`
- `MPESA_STKPUSH_QUERY_URL`
- `MPESA_CALLBACK_URL` (explicit callback URL override)

## Deployment Notes

- Use HTTPS for callback URLs.
- Add/update env vars in Vercel, then redeploy.
- Confirm Daraja app credentials match sandbox vs production environment.
