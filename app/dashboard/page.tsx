import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from "@/app/lib/db";
import { CreateNewAcademicPaper, GetStartedButton } from '../components/Submitbuttons';

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId, // Asegúrate de que 'userId' esté definido y sea del tipo correcto
    },
    select: {
      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });
  return data;
}

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  return (
    <div className="mx-4 md:mx-0">
      <div className="relative p-6">
        <div className="grid items-start gap-y-8">
          <div className="flex items-center justify-between">
            <div className="grid gap-3">
              <h1 className="text-3xl md:text-4xl font-semibold md:font-medium">
                Create Academic Papers
              </h1>
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
      </div>
    </div>
  );
}
