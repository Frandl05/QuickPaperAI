import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react"; // Asegúrate de importar el ícono correctamente
import { Button } from "@/components/ui/button"; // Asegúrate de importar el botón correctamente
import prisma from "@/app/lib/db"
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from "next/navigation";
import { getStripeSession, stripe } from "@/app/lib/stripe";
import { StripePortal, StripeSubscriptionCreationButton } from "@/app/components/Submitbuttons";


const featureItems = [
  { name: "Unlimited academic paper generation" },
  { name: "AI-detection proof content" },
  { name: "Instant PDF conversion and download" },
  { name: "Automatic index and bibliography" },
  { name: "Save valuable time and effort" },
];

async function getData(userId: string) {
    const data = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
      select: {
        status: true,
        user: {
          select: {
            stripeCustomerId: true,
          },
        },
      },
    });
  
    return data;
  }
  

  export default async function BillingPage() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const data = await getData(user?.id as string);

    async function createSubscription() {
        "use server";
      
        const dbUser = await prisma.user.findUnique({
          where: {
            id: user?.id,
          },
          select: {
            stripeCustomerId: true,
          },
        });
      
        if (!dbUser?.stripeCustomerId) {
          throw new Error("Unable to get customer id");
        }
      
        const subscriptionUrl = await getStripeSession ({
          customerId: dbUser.stripeCustomerId,
          domainUrl: "https://quickpaperai.com",
          priceId: process.env.STRIPE_PRICE_ID as string,
        }); 
        return redirect(subscriptionUrl);
      }

      async function createCustomerPortal() {
        "use server";
        const session = await stripe.billingPortal.sessions.create({
          customer: data?.user.stripeCustomerId as string,
          return_url: "https://quickpaperai.com/dashboard",
        });
      
        return redirect(session.url);
      }
      
      if (data?.status === "active") {
        return (
          <div className="px-4 md:px-0"> {/* Añadimos margen solo en móviles */}
            <div className="grid items-start gap-8 w-full"> {/* Ancho completo solo en móviles */}
              <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                  <h1 className="text-3xl md:text-4xl">Subscription</h1>
                  <p className="text-lg text-muted-foreground">
                    Settings regarding your subscription
                  </p>
                </div>
              </div>
        
              <Card className="md:w-2/3"> {/* Ancho para pantallas medianas hacia arriba */}
                <CardHeader>
                  <CardTitle>Edit Subscription</CardTitle>
                  <CardDescription>
                    Click on the button below to change your payment details and view your statement at the same time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={createCustomerPortal}>
                    <StripePortal />
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }        
             
        
      


  return (
    <div className="max-w-md mx-auto space-y-4 px-4 md:px-2">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary ">
              Monthly
            </h3>
          </div>

          <div className="mt-4 flex items-baseline text-6xl font-extrabold">
            $10 <span className="ml-1 text-2xl text-muted-foreground">/mo</span>
          </div>

          <p className="mt-5 text-lg text-muted-foreground">
            Generate as many academic papers as you want for $10 a month
          </p>
        </CardContent>
        <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10">
          <ul className="space-y-4">
            {featureItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <p className="ml-3 text-base ">{item.name}</p>
              </li>
            ))}
          </ul>
          <form className="w-full" action={createSubscription}>
            <StripeSubscriptionCreationButton/>
          </form>
        </div>
      </Card>
    </div>
  );
}  
