
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';
import Image from 'next/image';

const Feature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="text-5xl">{icon}</div>
    <h3 className="mt-2 text-xl font-semibold">{title}</h3>
    <p className="mt-1 text-center text-sm text-muted-foreground">{description}</p>
  </div>
);

const HowItWorksStep = ({ number, description }: { number: number; description: string }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">{number}</div>
    <p className="mt-2 text-center text-sm text-muted-foreground">{description}</p>
  </div>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 text-center">
        <div className="absolute inset-0 bg-fixed [background-position:50rem] [background-size:400px] opacity-5" style={{ backgroundImage: "url('/football-pattern.svg')" }} />
        <div className="container relative mx-auto">
          <div className="flex items-center justify-center text-7xl text-primary">
            <Image src="https://drive.google.com/uc?export=view&id=1m_sQfObWsqNZiycHdV4HYqhTOISdw8Ck" alt="Offside Club Logo" width={260} height={120} />
          </div>
          <h2 className="mt-4 text-4xl font-bold">Pasión por el fútbol más allá de los 90 minutos</h2>
          <p className="mt-2 text-lg text-muted-foreground">...próximamente en Play Store y App Store</p>
        </div>
      </section>

      {/* Core Concept Explanation */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Offside Club es una plataforma de social gaming donde puedes desafiar a tus amigos y demostrar quién tiene la mejor intuición futbolística. Haz predicciones sobre los partidos, responde preguntas sociales divertidas y sumérgete en una experiencia llena de emoción y risas.          </p>
          {/* <p className="text-lg text-muted-foreground">
            Offside Club es una plataforma de juego social donde los fanáticos del fútbol compiten con amigos haciendo predicciones de partidos y respondiendo preguntas sociales divertidas sobre su grupo.
          </p> */}
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
            icon={<Icons.questionCircle />} title="Preguntas Sociales"
            description="Responde preguntas sociales sobre tu grupo"
          />
          <Feature
            icon={<Icons.messageSquare />}
            title="Chat"
            description="Chatea y reacciona a las predicciones de tus amigos"
          />
        </div>
      </section>

      {/* How it Works Section */}
      {/* <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold">Cómo Funciona</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksStep number={1} description="Regístrate y crea un grupo con tus amigos." />
            <HowItWorksStep number={2} description="Haz predicciones sobre los próximos partidos de fútbol." />
            <HowItWorksStep number={3} description="Compite en las clasificaciones y responde preguntas sociales." />
          </div>
        </div>
      </section> */}

      {/* Email Signup Form */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold">¡Recibe una notificación cuando lancemos!</h2>
          <div className="mt-4 flex items-center justify-center">
            <Input type="email" placeholder="Ingresa tu correo electrónico" className="w-full md:w-auto max-w-md rounded-l-md" />
            <Button className="rounded-l-none rounded-r-md" >
              <Mail className="mr-2 h-4 w-4" />
              Notificarme
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Offside Club. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
