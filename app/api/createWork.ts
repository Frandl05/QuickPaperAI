import { NextResponse } from "next/server";
import prisma from "@/app/lib/db"; // Asegúrate de tener tu instancia de Prisma correctamente importada
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Asegúrate de estar usando el sistema de autenticación correcto

export async function POST(request: Request) {
  const { title, description, autores, numPaginas } = await request.json();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    // Crear el trabajo académico en la base de datos usando Prisma
    await prisma.note.create({
        data: {
          userId: user?.id,
          title: title,
          description: description || "", // Descripción opcional
          autores: autores,               // Los autores deben ser una cadena
          numPaginas: parseInt(numPaginas, 10), // Convertimos el número de páginas a entero
        },
      });
      

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al crear el trabajo académico:", error);
    return NextResponse.json({ error: "Error al crear el trabajo académico" }, { status: 500 });
  }
}
