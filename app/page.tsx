import Image from "next/image";
import { ThemeToggle } from "./components/Themetoggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from "next/navigation";
import { ShieldCheck, Download, FileText, Clock, Layers, PencilLine } from "lucide-react"; 
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CookieProvider } from "@/app/cookies/cookiecontext";
import CookieBanner from "@/app/cookies/cookiebanner";
import Head from 'next/head';


export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  
  if (await isAuthenticated()) {
    return redirect('/dashboard');
  }

  return (
    <CookieProvider>
       <Head>
        <title>Academic Paper AI Generator - QuickPaperAI</title>
        <meta name="description" content="Generate comprehensive, well-structured academic papers effortlessly. Supports multiple languages, AI detector-proof, automatic PDF generation and download." />
        <link rel="icon" href="/favicon.png" />
        {/* Open Graph meta tags */}
        <meta property="og:title" content="QuickPaperAI - Academic Paper AI Generator" />
        <meta property="og:description" content="Generate comprehensive, well-structured academic papers effortlessly. Supports multiple languages, AI detector-proof, automatic PDF generation and download." />
        <meta property="og:image" content="/favicon.png" />
        <meta property="og:type" content="website" />
      </Head>
    <section className="flex flex-col justify-between min-h-[100vh] overflow-x-hidden p-0 m-0">
      <div className="relative items-center w-full px-4 py-8 mx-auto max-w-full md:max-w-7xl md:px-8 lg:px-16">
        
        {/* Intro Section */}
        <div id="main-section" className="w-full max-w-full mx-auto text-center" style={{ marginTop: '2vh' }}>
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-secondary">
              <span className="text-sm md:text-base font-medium text-primary">
                Academic Paper AI Generator
              </span>
            </span>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Create Academic Papers with Ease
          </h1>
          <p className="w-full max-w-full mx-auto mt-3 text-lg md:text-lg lg:text-xl text-secondary-foreground">
            Generate well-structured and extensive academic papers effortlessly with QuickPaperAI, undetectable by AI detectors, and instantly converted to PDF for you.
          </p>
          <div className="flex justify-center w-full mx-auto mt-6 mb-16">
            <RegisterLink>
              <Button size="lg" className="w-full text-sm md:text-lg lg:text-xl">
                Sign Up for free
              </Button>
            </RegisterLink>
          </div>
        </div>

        {/* Demo Section */}
        <div id="demo-section" className="demo-section">
          <iframe
            src="https://app.supademo.com/embed/cm28zr1wu0fxhvm5sxpn9h1p4?embed_v=2"
            loading="lazy"
            title="Supademo Demo"
            allow="clipboard-write"
            allowFullScreen
            frameBorder="0"
            className="demo-iframe"
          ></iframe>
        </div>

{/* Features Section */}
<div className="text-center mt-16 mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-12">Features</h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 text-center">


    <Card className="shadow-lg"> 
              <CardHeader className="flex flex-col items-center">
                <ShieldCheck className="w-10 h-10 text-green-500 mb-2" />
                <CardTitle className="font-semibold text-xl">AI Detector-Proof</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Ensures generated text remains undetectable by AI detectors, giving a human touch to your content.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <FileText className="w-10 h-10 text-blue-500 mb-2" />
                <CardTitle className="font-semibold text-xl">Automatic PDF Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Instantly generates your academic paper in PDF format for easy sharing and submission.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <PencilLine className="w-10 h-10 text-purple-500 mb-2" />
                <CardTitle className="font-semibold text-xl">Extensive Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Produces well-researched, lengthy papers that cover topics in depth without falling short.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <Clock className="w-10 h-10 text-red-500 mb-2" />
                <CardTitle className="font-semibold text-xl">Fast Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Generates your academic work faster than any other AI paper generator available.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <Layers className="w-10 h-10 text-yellow-500 mb-2" />
                <CardTitle className="font-semibold text-xl">Well-Structured</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Includes essential sections like table of contents, bibliography, and well-organized content.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <Download className="w-10 h-10 text-teal-500 mb-2" />
                <CardTitle className="font-semibold text-xl">Automatic Download</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Conveniently downloads your paper as soon as it's ready, saving you time and effort.</p>
              </CardContent>
            </Card>
            </div>
        </div>

          {/* FAQ Section */}
        <div className="text-center mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4 text-left">
          
      
              <AccordionItem value="question-1">
                <AccordionTrigger>Why should I use QuickPaperAI for my academic work?</AccordionTrigger>
                <AccordionContent>QuickPaperAI is designed for students, researchers, and professionals who need to produce well-structured academic papers quickly and efficiently. Unlike traditional methods, which can take hours or even days, QuickPaperAI uses advanced algorithms to generate comprehensive and structured papers in a matter of minutes. This tool is ideal for anyone with limited time or those who want to streamline the writing process without sacrificing quality. With features like AI detector-proof content and automatic PDF download, QuickPaperAI stands out as a reliable and efficient academic tool.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-2">
                <AccordionTrigger> What should I do if I have an academic paper and no time to complete it?</AccordionTrigger>
                <AccordionContent>If you are under time constraints and need to complete an academic paper, QuickPaperAI can be a lifesaver. The platform allows you to input your topic and, with just a few clicks, generates a detailed, well-researched paper that meets academic standards. This eliminates the stress of last-minute writing and allows you to focus on reviewing and refining the content rather than starting from scratch. QuickPaperAI's fast processing and automated features make it an ideal solution for urgent academic needs.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-3">
                <AccordionTrigger>Can QuickPaperAI help me maintain a consistent academic style?</AccordionTrigger>
                <AccordionContent>Yes, QuickPaperAI is designed to produce content that adheres to academic standards and maintains a professional tone. The generated papers include structured sections like introductions, body paragraphs, and conclusions, with coherent flow and logical progression. This ensures that your work remains consistent in style, making it suitable for submission in academic settings. By using AI-driven algorithms, QuickPaperAI ensures that the content is not only informative but also presented in a scholarly format.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-4">
                <AccordionTrigger>How does QuickPaperAI handle different languages?</AccordionTrigger>
                <AccordionContent>QuickPaperAI supports multiple languages, including English, Spanish, Portuguese, German, and French. This allows users from various linguistic backgrounds to generate papers in their preferred language. The system automatically adjusts to the selected language, ensuring that the paper                 maintains the correct grammar, structure, and academic style. Whether you're a student or researcher working in a non-English-speaking country, QuickPaperAI provides a seamless experience for creating high-quality academic papers in your chosen language. This feature makes QuickPaperAI versatile and accessible to a global audience, ensuring that language barriers don't hinder your academic progress.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-5">
                <AccordionTrigger>What makes QuickPaperAI faster than other academic paper generators?</AccordionTrigger>
                <AccordionContent>QuickPaperAI utilizes cutting-edge AI technology to optimize the writing process, making it significantly faster than other academic paper generators. Our platform is engineered to handle complex topics and generate structured content within minutes. The AI algorithms are finely tuned to ensure a quick turnaround without compromising on quality. This speed advantage is especially beneficial for students and professionals with tight deadlines, allowing them to receive comprehensive papers faster than they would with traditional methods or competing tools.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-6">
                <AccordionTrigger>How does QuickPaperAI ensure my paper is undetectable by AI detectors?</AccordionTrigger>
                <AccordionContent>QuickPaperAI is specifically designed to generate content that reads naturally, making it challenging for AI detection tools to flag it as AI-generated. The platform uses advanced algorithms to add a human-like touch to the writing style, ensuring that the content flows smoothly and includes nuanced language typical of human authorship. This AI detector-proof feature is particularly valuable for students and researchers who want to ensure their work is perceived as original and authentic.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-7">
                <AccordionTrigger>What sections are automatically included in my academic paper with QuickPaperAI?</AccordionTrigger>
                <AccordionContent>QuickPaperAI provides a well-structured framework for academic papers, including essential sections such as a table of contents, main body content divided into coherent sections, and a bibliography. This structure adheres to standard academic formats, making the generated paper ready for submission in most academic settings. Additionally, QuickPaperAI ensures logical flow between sections, allowing for a comprehensive and organized presentation of information.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-8">
              <AccordionTrigger>Can I add multiple authors to my academic paper on QuickPaperAI?</AccordionTrigger>
              <AccordionContent>Yes, QuickPaperAI allows users to add multiple authors to their academic paper. This feature is particularly useful for collaborative projects where multiple contributors need to be acknowledged. You can easily input the names of all authors involved, ensuring they are correctly represented on the final document. This makes QuickPaperAI a flexible tool that supports both individual and collaborative academic work, helping users produce professional-grade papers with ease.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
   {/* Footer Section */}
  <footer className="bg-[#020816] text-white py-8 mt-12">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h2 className="text-2xl font-bold">QuickPaperAI</h2>
        <p className="text-gray-400">
          AI-powered academic paper generator: write with ease and precision instantly.
        </p>
      </div>
      <div className="flex space-x-6 text-center">
        <a href="https://quickpaperai.com/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</a>
        <a href="https://quickpaperai.com/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</a>
      </div>
    </div>
  </footer>

  <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function () {
                const demoSection = document.getElementById("demo-section");
                
                if (demoSection) {
                  const isMobile = window.innerWidth <= 768;
                  const observerOptions = isMobile
                    ? { rootMargin: "-35% 0px -35% 0px", threshold: 0.2 }
                    : { threshold: 0.5 };

                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting) {
                        demoSection.classList.add("sticky-active");
                      } else {
                        demoSection.classList.remove("sticky-active");
                      }
                    },
                    observerOptions
                  );
                  observer.observe(demoSection);
                }
              });
            `,
          }}
        />
      </section>
  <CookieBanner />
</CookieProvider>
  );
}