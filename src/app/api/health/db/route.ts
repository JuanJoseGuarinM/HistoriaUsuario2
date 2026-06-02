import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const connection = await connectToDatabase();

    return NextResponse.json({
      ok: true,
      status: "connected",
      dbName: connection.connection.name,
      readyState: mongoose.connection.readyState,
      ...(isProduction ? {} : { host: connection.connection.host })
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "error",
        ...(isProduction
          ? {}
          : {
              message: error instanceof Error ? error.message : "Unknown error"
            })
      },
      { status: 500 }
    );
  }
}
