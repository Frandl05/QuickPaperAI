import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from "@/app/lib/db"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateNewAcademicPaper, GetStartedButton } from '../components/Submitbuttons';
import {unstable_noStore as noStore } from "next/cache";
async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique ({
    where: {
      id: userId, // Asegúrate de que 'userId' esté definido y sea del tipo correcto
    },
      select:{
        Subscription: {
          select:{
            status: true,


          },
        },
      },
  });
  return data;
}


export default async function DashboardPage(){
  const {getUser}=getKindeServerSession();
  const user=await getUser();
  const data=await getData(user?.id as string);
  return (
    <div className="mx-4 md:mx-0"> {/* Margen lateral en móviles */}
      <Card className="relative p-6"> {/* Eliminadas las clases de sombra y gradiente */}
        <div className="grid items-start gap-y-8"> {/* Asegura que haya espacio entre el texto y los bordes */}
          <div className="flex items-center justify-between">
            <div className="grid gap-3"> {/* Aumentar espacio entre título y subtítulo */}
              <h1 className="text-3xl md:text-4xl font-semibold md:font-medium">
                Create Academic Papers
              </h1> {/* font-semibold en móviles, font-medium en pantallas más grandes */}
              <p className="text-lg text-muted-foreground">
                Here you can create your new academic papers with AI
              </p>
            </div>
          </div>
          {data?.Subscription?.status === "active" ? (
            <CreateNewAcademicPaper />
          ) : (
            <GetStartedButton />
          )}
        </div>
      </Card>
    </div>
  );
}  