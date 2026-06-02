# RegistryPlus

Plataforma sencilla de gestión de miembros y control de acceso.

## Acceso Administrador (Semilla)
- **Correo:** david@gmail.com
- **Contraseña:** 123123

## Instrucciones de Inicio
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Inicializar base de datos con la cuenta administradora:
   ```bash
   npm run seed:admin
   ```
3. Iniciar en desarrollo:
   ```bash
   npm run dev
   ```

## Variables de Entorno (.env)
- `DATABASE_URL`: Cadena de conexión de MongoDB.
- `DATABASE_NAME`: Nombre de la base de datos.
- `AUTH_SECRET`: Clave secreta para cookies de sesión.
- `SMTP_USER`: Correo emisor para notificaciones.
- `SMTP_PASSWORD`: Contraseña de aplicación del correo emisor.
