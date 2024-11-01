import Image from "next/image";
import { ThemeToggle } from "./components/Themetoggle";
import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from "next/navigation";
import {unstable_noStore as noStore } from "next/cache";
export default async function Home() {
    const { isAuthenticated } = getKindeServerSession();
  
    if (await isAuthenticated()) {
      noStore();
      return redirect('/dashboard');
    }

    return (
      <section className="flex flex-col justify-between bg-background min-h-[100vh] overflow-x-hidden p-0 m-0">
        {/* Contenedor principal */}
        <div className="relative items-center w-full px-4 py-8 mx-auto max-w-full md:max-w-7xl md:px-8 lg:px-16">
          <div id="main-section" className="w-full max-w-full mx-auto text-center" style={{ marginTop: '2vh' }}> {/* Aseguramos w-full y max-w-full */}
            {/* Contenido principal */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-secondary">
                <span className="text-sm md:text-base font-medium text-primary">
                  Academic Paper AI Generator
                </span>
              </span>
            </div>
            <h1 className="mt-4 text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Create Academic Papers with Ease
            </h1>
            <p className="w-full max-w-full mx-auto mt-3 text-sm md:text-lg lg:text-xl text-secondary-foreground">
              Generate well-structured and extensive academic papers effortlessly with QuickPaperAI, undetectable by AI detectors, and instantly converted to PDF for you.
            </p>
            <div className="flex justify-center w-full mx-auto mt-6 mb-11">
              <RegisterLink>
                <Button size="lg" className="w-full text-sm md:text-lg lg:text-xl">
                  Sign Up for free
                </Button>
              </RegisterLink>
            </div>
          </div>
  
          {/* Demo con proporción fija */}
          <div id="demo-section" style={{ borderRadius: '8px' }}> {/* Bordes más afilados */}
            <iframe
              src="https://app.supademo.com/embed/cm28zr1wu0fxhvm5sxpn9h1p4?embed_v=2"
              loading="lazy"
              title="Supademo Demo"
              allow="clipboard-write"
              allowFullScreen
              frameBorder="0"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '8px',
              }}
            ></iframe>
          </div>
        </div>
      </section>
    );
}
