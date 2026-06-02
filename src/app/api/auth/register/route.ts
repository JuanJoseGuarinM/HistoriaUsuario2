import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendWelcomeEmail } from "@/lib/mailer";
import { getValidationMessage, registerSchema } from "@/lib/validators/user";
import { User } from "@/models/User";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const { nombre, cc, email, password } = registerSchema.parse(await request.json());

    await connectToDatabase();
    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { message: "Ya existe un usuario con ese email." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await User.create({
      nombre,
      cc,
      email,
      password: hashedPassword,
      role: "user"
    });

    try {
      await sendWelcomeEmail({
        nombre,
        email,
        password,
        role: "user"
      });
    } catch (error) {
      console.error("No fue posible enviar el correo de bienvenida.", error);
    }

    return NextResponse.json(
      {
        user: {
          _id: created._id.toString(),
          nombre: created.nombre,
          email: created.email,
          role: created.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: getValidationMessage(error) }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "No fue posible crear la cuenta.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
