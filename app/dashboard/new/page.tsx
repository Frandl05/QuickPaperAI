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
import {unstable_noStore as noStore } from "next/cache";


export default function NewWorkRoute() {
  noStore();
  const [autores, setAutores] = useState<string[]>([""]);
  const [generatedText, setGeneratedText] = useState<string | null>(null); // Para almacenar el texto generado por OpenAI
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
    let autor = "Autor";  // Nueva variable para Autor
 
    if (selectedIdioma === "en") {
      indice = "INDEX";
      contenido = "CONTENT";
      bibliografia = "BIBLIOGRAPHY";
      autor = "Author";  // Traducción en inglés
    } else if (selectedIdioma === "fr") {
      indice = "INDEX";
      contenido = "CONTENU";
      bibliografia = "BIBLIOGRAPHIE";
      autor = "Auteur";  // Traducción en francés
    } else if (selectedIdioma === "pt") {
      indice = "ÍNDICE";
      contenido = "CONTEÚDO";
      bibliografia = "BIBLIOGRAFIA";
      autor = "Autor";  // Traducción en portugués (igual que en español)
    } else if (selectedIdioma === "de") {
      indice = "INHALTSVERZEICHNIS";
      contenido = "INHALT";
      bibliografia = "BIBLIOGRAPHIE";
      autor = "Autor";  // Traducción en alemán (igual que en español)
    }
 
    // Calcular la posición en el centro vertical
    let titleFontSize = 40;
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
 
    // Página 2: Índice
    const index = content.match(new RegExp(`###${indice}###([\\s\\S]+?)###${contenido}###`))?.[1];
    if (index) {
      doc.addPage();
      yPosition = margin;
 
      // Añadir título centrado del índice
      doc.setFont("helvetica", "bold");
      doc.setFontSize(21);
      doc.text(indice, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
 
      // Añadir el contenido del índice
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const indexLines: string[] = doc.splitTextToSize(index, pageWidth - margin * 2);
      indexLines.forEach((line: string) => {
        if (yPosition + 10 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition, { align: "justify" });
        yPosition += 10;
      });
    }
 
    // Página 3: Contenido
    const bodyContent = content.match(new RegExp(`###${contenido}###([\\s\\S]+?)###${bibliografia}###`))?.[1];
    if (bodyContent) {
      doc.addPage();
      yPosition = margin;
      const bodyLines: string[] = bodyContent.split("\n");
      bodyLines.forEach((line: string) => {
        if (line.startsWith("###")) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(24); // Títulos principales
        } else if (line.startsWith("##")) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(19); // Subtítulos
        } else {
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal"); // Texto normal
        }
 
        const wrappedLines: string[] = doc.splitTextToSize(line.replace(/###|##/g, ""), pageWidth - margin * 2);
        wrappedLines.forEach((wrappedLine: string) => {
          if (yPosition + 10 > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(wrappedLine, margin, yPosition, { align: "justify" });
          yPosition += 10;
        });
      });
    }
 
    // Última página: Bibliografía
    const bibliography = content.match(new RegExp(`###${bibliografia}###([\\s\\S]+)`))?.[1];
    if (bibliography) {
      doc.addPage();
      yPosition = margin;
 
      // Añadir título centrado
      doc.setFont("helvetica", "bold");
      doc.setFontSize(21);
      doc.text(bibliografia, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
 
      // Añadir contenido de la bibliografía
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const bibliographyLines: string[] = doc.splitTextToSize(bibliography, pageWidth - margin * 2);
      bibliographyLines.forEach((line: string) => {
        if (yPosition + 10 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition, { align: "justify" });
        yPosition += 10;
      });
    }
 
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
    const idioma = selectedIdioma;  // Capturamos el idioma seleccionado

    try {
      let accumulatedContent = ''; // Inicializa el contenido acumulado
      let currentStep = 1; // Empezamos en el primer paso
      const totalSteps = 3; // Total de pasos a completar
      let result;

      // Loop para manejar los múltiples pasos
      while (currentStep <= totalSteps) {
        // Progreso en 3 pasos: 25%, 50%, y 75%
        const stepProgress = (currentStep / totalSteps) * 75;

        setProgress(stepProgress); // Actualiza el progreso basado en el paso actual

        // Llamada a la API
        const response = await fetch("/api/generateWork", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            autores: autoresString,
            idioma,
            accumulatedContent,  // Enviar el contenido acumulado
            currentStep,          // Enviar el número del paso actual
          }),
        });

        result = await response.json();

        if (!result.generatedText) {
          throw new Error("No se generó ningún texto.");
        }

        // Aquí verificamos que el contenido generado sea el esperado
        console.log('Texto generado en el paso', currentStep, ':', result.generatedText);

        // Actualizamos el contenido acumulado
        accumulatedContent = result.generatedText;

        await new Promise(resolve => setTimeout(resolve, 500)); // Pausa de 500ms

        // Avanzamos al siguiente paso
        currentStep = result.nextStep || currentStep + 1;
      }

      // Una vez completados todos los pasos, guardar el contenido generado final
      setGeneratedText(accumulatedContent);

      // Simula el progreso a 100% para la generación del PDF
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa de 500ms
      generatePDF(accumulatedContent, title, autoresString);

      // Redirige al usuario al dashboard después de completar el proceso
      router.push('/dashboard');
    } catch (error) {
      console.error("Error al generar el trabajo:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-4 md:mx-0"> {/* Margen lateral en móviles */}
      <Card className="relative">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Academic Paper</CardTitle>
            <CardDescription>
              Complete the following fields to generate your academic paper
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-5">
            {/* Título del trabajo académico */}
            <div className="gap-y-2 flex flex-col">
              <Label>Title</Label>
              <Input
                required
                type="text"
                name="title"
                placeholder={"Title for your academic paper"}
              />
            </div>
  
            {/* Selección de idioma */}
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