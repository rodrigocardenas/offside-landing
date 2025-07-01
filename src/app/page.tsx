'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useTransition } from 'react';
import { saveEmail } from './actions'; // Import the server action
import { useToast } from "@/hooks/use-toast"; // Import useToast hook

// Removed redundant Toaster import as it's in layout.tsx

const Feature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center p-4 text-center">
    <div className="text-5xl text-primary">{icon}</div>
    <h3 className="mt-2 text-xl font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
  </div>
);

const HowItWorksStep = ({ number, description }: { number: number; description: string }) => (
  <div className="flex flex-col items-center justify-center p-4 text-center">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">{number}</div>
    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
  </div>
);

export default function Home() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast(); // Initialize useToast

  const handleNotifyMe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("[Client] handleNotifyMe triggered"); // Client log

    // Client-side validation
    if (!email) {
      console.log("[Client] Validation failed: Email empty"); // Client log
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico.",
        variant: "destructive",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        console.log("[Client] Validation failed: Invalid email format"); // Client log
        toast({
          title: "Error",
          description: "Por favor ingresa un correo electrónico válido.",
          variant: "destructive",
        });
        return;
      }

    console.log("[Client] Starting transition..."); // Client log
    startTransition(async () => {
      console.log("[Client] Inside transition: Calling saveEmail..."); // Client log
      try {
        const result = await saveEmail(email);
        console.log("[Client] saveEmail result:", result); // Client log
        if (result.success) {
          console.log("[Client] Success branch: Showing success toast"); // Client log
          toast({
            title: "¡Gracias!",
            description: "Te notificaremos cuando lancemos.",
          });
          setEmail(''); // Clear input on success
        } else {
          console.log("[Client] Error branch: Showing error toast", result.error); // Client log
          toast({
            title: "Error",
            description: result.error || "Hubo un problema al guardar tu correo. Intenta de nuevo.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("[Client] Catch block: Error saving email:", error); // Client log
        toast({
          title: "Error",
          description: "Hubo un problema inesperado. Intenta de nuevo.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 text-center">
        {/* Optional: Add subtle pattern */}
        <div
            className="absolute inset-0 bg-fixed opacity-5"
            style={{
                backgroundImage: "url('/football-pattern.svg')", // Ensure you have this SVG or remove/change
                backgroundSize: '400px',
                backgroundPosition: '50rem',
            }}
        />
        <div className="container relative mx-auto">
          <div className="flex items-center justify-center mb-6"> {/* Added margin-bottom */}
            {/* Using next/image with configured host */}
            <Image
              src="https://drive.google.com/uc?export=view&id=1m_sQfObWsqNZiycHdV4HYqhTOISdw8Ck"
              alt="Offside Club Logo"
              width={260} // Increased size
              height={120} // Increased size
              priority // Add priority for LCP element
            />
          </div>
          <h2 className="mt-4 text-4xl font-bold">La app predictiva sin apuestas donde tú eres protagonista</h2>
          <div className="mt-6">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-primary hover:bg-primary/90"
              onClick={() => window.open('https://app.offsideclub.es/', '_blank')}
            >
              ¡Jugar Ya!
            </Button>
          </div>
        </div>
      </section>

      {/* Core Concept Explanation */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Offside Club es una plataforma de social gaming donde puedes desafiar a tus amigos y demostrar quién tiene la mejor intuición futbolística. Haz predicciones sobre los partidos, responde preguntas sociales divertidas y sumérgete en una experiencia llena de emoción y risas.          </p>
        </div>
      </section>

      {/* Sección Dinámica de Juego (sin overlay ni botón) */}
      <section className="relative w-full flex justify-center items-center min-h-[400px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px] overflow-hidden">
        <Image
          src="/dinamica-juego.png"
          alt="Dinámica de juego Offside Club"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className="z-0"
          priority={true}
        />
      </section>

      {/* Key Features Display */}
      <section className="py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <Feature
            icon={<Icons.shield />}
            title="Predicciones"
            description="Haz predicciones sobre partidos de fútbol"
          />
          <Feature
            icon={<Icons.server />}
            title="Clasificaciones"
            description="Compite en clasificaciones con tus amigos"
          />
          <Feature
            icon={<Icons.messageSquare />} 
            title="Preguntas Sociales"
            description="Responde preguntas sociales sobre tu grupo"
          />
           <Feature
            icon={<Icons.messageSquare />} // Consider a different icon?
            title="Chat"
            description="Chatea y reacciona a las predicciones de tus amigos"
          />
        </div>
      </section>


      {/* Email Signup Form */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold">Quieres saber más? Escribenos tu correo y te contaremos todo lo que tenemos preparado</h2>
          {/* Form now uses onSubmit */}
          <form onSubmit={handleNotifyMe} className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
            <Input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="w-full md:w-auto max-w-md rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending} // Disable input while pending
            />
            <Button type="submit" className="w-full sm:w-auto rounded-md" disabled={isPending}>
              {isPending ? <Icons.spinner className="animate-spin mr-2" /> : <Mail className="mr-2 h-4 w-4" />}
              Notificarme
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground">
        <div className="container mx-auto">
          <div className="flex flex-col items-center space-y-4">
            {/* Social Media Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://www.instagram.com/offside_game_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Síguenos en Instagram"
              >
                <Icons.instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/offside-club/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Síguenos en LinkedIn"
              >
                <Icons.linkedin className="h-6 w-6" />
              </a>
            </div>
            {/* Copyright */}
            <p>© {new Date().getFullYear()} Offside Club. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
