const { Resend } = require("resend");

const sendResetEmail = async (to, token) => {
  const base =
    process.env.FRONTEND_URL || "http://localhost:3001";
  const resetLink = `${base.replace(/\/$/, "")}/reset-password?token=${token}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("\n📧 [DEV] Resend sin API key — enlace de recuperación (cópialo en el navegador):\n");
    console.log(resetLink);
    console.log("\n");
    return;
  }

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to,
      subject: "Recuperación de contraseña — SGIM",
      html: `
      <h3>Recuperación de contraseña</h3>
      <p>Haz clic en el siguiente enlace:</p>
      <p><a href="${resetLink}">Restablecer contraseña</a></p>
      <p>Si no funciona el botón, copia y pega esta URL en el navegador:</p>
      <p style="word-break:break-all;font-size:12px;">${resetLink}</p>
      <p>Expira en 30 minutos.</p>
    `,
    });
  } catch (err) {
    console.error("🔴 Resend: error al enviar correo:", err?.message || err);
    console.log("\n📧 Enlace de recuperación (usa este enlace si el correo no llegó):\n");
    console.log(resetLink);
    console.log("\n");
  }
};

module.exports = { sendResetEmail };