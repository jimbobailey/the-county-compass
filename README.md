# The County Compass

Static directory website hosted on Netlify with Netlify Functions and Blobs.

## Required Netlify environment variables

- `ADMIN_PASSWORD`: password used for the private administration area.
- `ADMIN_SESSION_SECRET`: long random value used to sign eight-hour admin sessions.
- `NOTIFY_EMAIL`: address that receives submission notifications.
- `EMAIL_USER`: Gmail address used to send notifications.
- `EMAIL_PASS`: Google app password stored only in Netlify.

Never commit credentials, tokens, passwords, or screenshots containing them.

## Submission images

The browser validates the selected file, resizes it to a standard 1200 x 675
canvas, converts it to WEBP, and sends it with the listing. The server validates
the result, stores it in Netlify Blobs, and records the generated image URL with
the pending submission.
