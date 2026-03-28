const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev", // temporal
    to: 'a3523110097@alumno.uttehuacan.edu.mx',
    subject: "Recuperación de contraseña",
    html: `
      <h3>Recuperación de contraseña</h3>
      <p>Haz clic en el siguiente enlace:</p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Expira en 30 minutos.</p>
    `
  });
};

module.exports = { sendResetEmail };