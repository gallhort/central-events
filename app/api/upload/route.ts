import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadFile } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 5MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${session.user.id}/${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFile("prestataires-photos", filename, buffer, file.type);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/upload:", error);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}
