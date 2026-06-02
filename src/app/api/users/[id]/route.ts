import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/apiAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { getValidationMessage, updateUserSchema } from "@/lib/validators/user";
import { User } from "@/models/User";
import { ZodError } from "zod";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const authError = requireAdminSession(request);

    if (authError) {
      return authError;
    }

    const { id } = await params;
    const { nombre, cc, email, password, role } = updateUserSchema.parse(await request.json());

    await connectToDatabase();

    const existing = await User.findOne({
      email,
      _id: { $ne: id }
    });

    if (existing) {
      return NextResponse.json(
        { message: "Ya existe otro usuario con ese email." },
        { status: 409 }
      );
    }

    const updates: Record<string, string> = {
      nombre,
      cc,
      email,
      role
    };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true
    });

    if (!updated) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: updated._id.toString(),
        nombre: updated.nombre,
        cc: updated.cc,
        email: updated.email,
        role: updated.role,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: getValidationMessage(error) }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "No fue posible actualizar el usuario.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const authError = requireAdminSession(_);

    if (authError) {
      return authError;
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible eliminar el usuario.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
