import nodemailer from "nodemailer";

require("dotenv").config();

const port = parseInt(process.env.SMTP_PORT || "") || 587;
export const transport =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : undefined;

if (typeof transport === "undefined") {
  console.error("no email service configured.");
} else {
  console.log("email service configured.");
}

export const sender = {
  name: process.env.EMAIL_FROM_NAME || "remix-payload app",
  address: process.env.EMAIL_FROM || "app@example.com",
};
export const from = `${sender.name} <${sender.address}>`;
export const connectedEmailAddresses =
  process.env.CONNECTED_EMAIL_ADDRESSES?.split(",")
    .map((x) => x.trim())
    .filter(Boolean) || [];

if (!connectedEmailAddresses.length) {
  console.error("no connected email addresses configured.");
} else {
  console.log("connected email addresses:", connectedEmailAddresses);
}

export default transport;
