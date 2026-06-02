import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { setSessionCookie } from "@/lib/session";
import { getValidationMessage, loginSchema } from "@/lib/validators/user";
import { User } from "@/models/User";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const { email, password } = loginSchema.parse(await request.json());

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: "Email o contrasena incorrectos." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Email o contrasena incorrectos." },
        { status: 401 }
      );
    }

    const sessionUser = {
      _id: user._id.toString(),
      nombre: user.nombre,
      email: user.email,
      role: user.role
    };
    const response = NextResponse.json({
      user: sessionUser
    });

    setSessionCookie(response, sessionUser);

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: getValidationMessage(error) }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "No fue posible iniciar sesion.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
