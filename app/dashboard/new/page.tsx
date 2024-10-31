"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SubmitButton } from "@/app/components/Submitbuttons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf"; // Importamos jsPDF
import { Progress } from "@/components/ui/progress";
import { Plus, Minus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { unstable_noStore as noStore } from "next/cache";

export default function NewWorkRoute() {
  noStore();
  const [autores, setAutores] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false); // Nuevo estado para manejar la carga
  const [progress, setProgress] = useState<number>(0); // Progreso
  const [selectedIdioma, setSelectedIdioma] = useState("en"); // Estado para el idioma
  const router = useRouter();

  // Función para añadir nuevos autores dinámicamente
  const handleAddAutor = () => {
    setAutores([...autores, ""]);
  };

  // Función para eliminar autores
  const handleRemoveAutor = (index: number) => {
    const newAutores = autores.filter((_, i) => i !== index);
    setAutores(newAutores);
  };

  // Función para actualizar el valor de los autores
  const handleAutorChange = (index: number, value: string) => {
    const newAutores = [...autores];
    newAutores[index] = value;
    setAutores(newAutores);
  };

  // Función para generar el PDF con jsPDF dependiendo del idioma seleccionado
  const generatePDF = (content: string, title: string, autores: string) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    // Variables de acuerdo con el idioma seleccionado
    let indice = "ÍNDICE";
    let contenido = "CONTENIDO";
    let bibliografia = "BIBLIOGRAFÍA";
    let autor = "Autor"; // Nueva variable para Autor

    if (selectedIdioma === "en") {
      indice = "INDEX";
      contenido = "CONTENT";
      bibliografia = "BIBLIOGRAPHY";
      autor = "Author"; // Traducción en inglés
    } else if (selectedIdioma === "fr") {
      indice = "INDEX";
      contenido = "CONTENU";
      bibliografia = "BIBLIOGRAPHIE";
      autor = "Auteur"; // Traducción en francés
    } else if (selectedIdioma === "pt") {
      indice = "ÍNDICE";
      contenido = "CONTEÚDO";
      bibliografia = "BIBLIOGRAFIA";
      autor = "Autor"; // Traducción en portugués (igual que en español)
    } else if (selectedIdioma === "de") {
      indice = "INHALTSVERZEICHNIS";
      contenido = "INHALT";
      bibliografia = "BIBLIOGRAPHIE";
      autor = "Autor"; // Traducción en alemán (igual que en español)
    }

    // Calcular la posición en el centro vertical
    const titleFontSize = 40;
    const titleHeight = titleFontSize * 1.5;
    let yPosition = (pageHeight - titleHeight) / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(50);

    // Título centrado
    const wrappedTitle: string[] = doc.splitTextToSize(title.toUpperCase(), pageWidth - margin * 2);
    wrappedTitle.forEach((line: string) => {
      if (yPosition + 10 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 20;
    });
    yPosition += 10;

    // Autor centrado en la página
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(128, 128, 128);

    const wrappedAuthor: string[] = doc.splitTextToSize(`${autor}: ${autores}`, pageWidth - margin * 2);
    wrappedAuthor.forEach((line: string) => {
      if (yPosition + 10 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
    });

    // Restablecer color del texto a negro
    doc.setTextColor(0, 0, 0);

    // Guardar el PDF generado
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, ""); // Elimina caracteres especiales
    const fileName = `${sanitizedTitle}.pdf`; // Genera el nombre del archivo
    doc.save(fileName);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setProgress(0); // Inicializa el progreso en 0 cuando comienza la acción

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const autoresString = autores.join(", ");
    const idioma = selectedIdioma; // Capturamos el idioma seleccionado

    try {
      let accumulatedContent = ''; // Inicializa el contenido acumulado
      let currentStep = 1; // Empezamos en el primer paso
      const totalSteps = 3; // Total de pasos a completar
      let result;

      while (currentStep <= totalSteps) {
        const stepProgress = (currentStep / totalSteps) * 75;
        setProgress(stepProgress);

        const response = await fetch("/api/generateWork", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, autores: autoresString, idioma, accumulatedContent, currentStep }),
        });

        result = await response.json();
        if (!result.generatedText) throw new Error("No se generó ningún texto.");

        accumulatedContent = result.generatedText;
        await new Promise(resolve => setTimeout(resolve, 500));
        currentStep = result.nextStep || currentStep + 1;
      }

      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));
      generatePDF(accumulatedContent, title, autoresString);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error al generar el trabajo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 md:mx-0">
      <Card className="relative">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Academic Paper</CardTitle>
            <CardDescription>
              Complete the following fields to generate your academic paper
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-5">
            <div className="gap-y-2 flex flex-col">
              <Label>Title</Label>
              <Input required type="text" name="title" placeholder={"Title for your academic paper"} />
            </div>

            <div className="space-y-1">
              <Label>Select Language</Label>
              <Select name="idioma" defaultValue="en" onValueChange={setSelectedIdioma}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
  
            {/* Campos dinámicos para autores */}
            <div className="flex flex-col gap-y-2">
              <Label>Authors</Label>
              {autores.map((autor, index) => (
                <div key={index} className="flex items-center gap-x-2 justify-between">
                  <Input
                    required
                    type="text"
                    value={autor}
                    onChange={(e) => handleAutorChange(index, e.target.value)}
                    placeholder={`Author ${index + 1}`}
                  />
                  {index > 0 ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="rounded-full p-2"
                      onClick={() => handleRemoveAutor(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full p-2"
                      onClick={handleAddAutor}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="destructive">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton loading={loading} />
          </CardFooter>
  
          {/* Componente de progreso con márgenes */}
          {progress > 0 && (
            <div className="px-6 py-4 mb-4">
              <Progress value={progress} />
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}  