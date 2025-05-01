
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
          <h1 className="mt-4 text-4xl font-bold">Pasión por el fútbol más allá de los 90 minutos</h1>
          <p className="mt-2 text-lg text-muted-foreground">...próximamente en Play Store y App Store</p>
        </div>
      </section>

      {/* Core Concept Explanation */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Offside Club es una plataforma de juego social donde los fanáticos del fútbol compiten con amigos haciendo predicciones de partidos y respondiendo preguntas sociales divertidas sobre su grupo.
          </p>
        </div>
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

      {/* How it Works Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold">Cómo Funciona</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksStep number={1} description="Regístrate y crea un grupo con tus amigos." />
            <HowItWorksStep number={2} description="Haz predicciones sobre los próximos partidos de fútbol." />
            <HowItWorksStep number={3} description="Compite en las clasificaciones y responde preguntas sociales." />
          </div>
        </div>
      </section>

      {/* Email Signup Form */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold">¡Recibe una notificación cuando lancemos!</h2>
          {/* Form now uses onSubmit */}
          <form onSubmit={handleNotifyMe} className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
            <Input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="w-full md:w-auto max-w-md rounded-md sm:rounded-l-md sm:rounded-r-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending} // Disable input while pending
              aria-label="Correo electrónico para notificaciones"
            />
            <Button type="submit" className="w-full sm:w-auto rounded-md sm:rounded-l-none sm:rounded-r-md" disabled={isPending}>
              {isPending ? (
                <Icons.spinner className="animate-spin mr-2" /> // Show spinner when pending
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Notificarme
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground">
        {/* Using JS Date object only on client after mount (or using a Server Component would be better) */}
        {/* For simplicity here, we assume this component runs long enough after hydration */}
        <p>© {new Date().getFullYear()} Offside Club. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
