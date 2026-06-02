import nodemailer from "nodemailer";

type WelcomeEmailInput = {
  nombre: string;
  email: string;
  password: string;
  role: string;
};

const GMAIL_APP_PASSWORD_LENGTH = 16;

function normalizeEnvValue(value?: string) {
  return value?.trim();
}

function normalizeGmailAppPassword(value?: string) {
  return value?.replace(/\s+/g, "").trim();
}

function getMailConfig() {
  const user = normalizeEnvValue(process.env.SMTP_USER);
  const pass = normalizeGmailAppPassword(process.env.SMTP_PASSWORD);

  if (!user || !pass) {
    throw new Error("Faltan SMTP_USER o SMTP_PASSWORD en las variables de entorno.");
  }

  if (pass.length !== GMAIL_APP_PASSWORD_LENGTH) {
    throw new Error(
      "La clave de correo no parece una App Password de Gmail valida. Usa la contrasena de aplicacion de 16 caracteres, no una API key."
    );
  }

  return { user, pass };
}

function getTransporter() {
  const { user, pass } = getMailConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildWelcomeEmailHtml({
  nombre,
  email,
  password,
  role
}: WelcomeEmailInput) {
  const safeNombre = escapeHtml(nombre);
  const safeEmail = escapeHtml(email);
  const safePassword = escapeHtml(password);
  const safeRole = escapeHtml(role);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">¡Bienvenido a RegistryPlus!</h2>
      <p>Hola <strong>${safeNombre}</strong>,</p>
      <p>Tu cuenta ha sido creada correctamente en nuestra plataforma. A continuación, encontrarás tus credenciales de acceso temporales:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border: 1px solid #e2e8f0;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Correo Electrónico:</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Contraseña Temporal:</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 15px;">${safePassword}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: bold;">Rol Asignado:</td>
          <td style="padding: 12px;">${safeRole}</td>
        </tr>
      </table>

      <p style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; font-size: 14px;">
        <strong>Nota importante:</strong> Por motivos de seguridad, te recomendamos cambiar esta contraseña temporal después de iniciar sesión por primera vez.
      </p>
      
      <p>Para ingresar, ve a la página de inicio de sesión de RegistryPlus.</p>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      
      <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
        Este es un correo automático. Por favor, no respondas directamente a este mensaje.
      </p>
    </div>
  `;
}

export async function sendWelcomeEmail({
  nombre,
  email,
  password,
  role
}: WelcomeEmailInput) {
  const transporter = getTransporter();
  const { user: from } = getMailConfig();

  await transporter.sendMail({
    from,
    to: email,
    subject: "Bienvenido a RegistryPlus",
    html: buildWelcomeEmailHtml({ nombre, email, password, role })
  });
}
