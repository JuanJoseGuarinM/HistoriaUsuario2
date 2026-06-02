import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/apiAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { sendWelcomeEmail } from "@/lib/mailer";
import { createUserSchema, getValidationMessage } from "@/lib/validators/user";
import { User } from "@/models/User";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const authError = requireAdminSession(request);

    if (authError) {
      return authError;
    }

    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({
      users: users.map((user) => ({
        _id: user._id.toString(),
        nombre: user.nombre,
        cc: user.cc,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible consultar usuarios.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authError = requireAdminSession(request);

    if (authError) {
      return authError;
    }

    const { nombre, cc, email, password, role } = createUserSchema.parse(await request.json());

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
      role
    });

    try {
      await sendWelcomeEmail({ nombre, email, password, role });
    } catch (error) {
      console.error("No fue posible enviar el correo de bienvenida.", error);
    }

    return NextResponse.json(
      {
        user: {
          _id: created._id.toString(),
          nombre: created.nombre,
          cc: created.cc,
          email: created.email,
          role: created.role,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt
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
        message: "No fue posible crear el usuario.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
