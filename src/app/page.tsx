
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';

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
          <div className="flex items-center justify-center text-6xl text-primary">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-heart mr-2"><path d="M11 10V5c0-1.5 1-2 2-2 .8 0 1.3.5 1.6 1 0 0 3 0 3 4v5" /><path d="m3 13 4 4 6-4" /><path d="M7 21h11" /><path d="M8 13h5l4 4 2-2" /><path d="M22.4 14.7a2 2 0 0 0-2.7-3.4L19 11" /><path d="M17.5 15.5a2 2 0 0 0 2.7 3.4L21 17" /><path d="M12 21a9 9 0 1 0 0-18c0 2.8 1 5 3 7 0 .8-.7 1.6-1.5 1.5-.8 0-1.5.7-1.5 1.5 0 2.3 2 3.5 2 5" /></svg>
            Offside Club
          </div>
          <h1 className="mt-4 text-4xl font-bold">Football Predictions. Social Gaming.</h1>
          <p className="mt-2 text-lg text-muted-foreground">Coming Soon to Play Store and App Store</p>
        </div>
      </section>

      {/* Core Concept Explanation */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Offside Club is a social gaming platform where football fans compete with friends by making match predictions and answering fun social questions about their group.
          </p>
        </div>
      </section>

      {/* Key Features Display */}
      <section className="py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <Feature
            icon={<Icons.shield />}
            title="Predictions"
            description="Make predictions on football matches"
          />
          <Feature
            icon={<Icons.server />}
            title="Rankings"
            description="Compete in rankings with your friends"
          />
          <Feature
            icon={<Icons.messageSquare />}
            title="Social Questions"
            description="Answer social questions about your group"
          />
          <Feature
            icon={<Icons.messageSquare />}
            title="Chat"
            description="Chat and react to your friends' predictions"
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold">How it Works</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksStep number={1} description="Sign up and create a group with your friends." />
            <HowItWorksStep number={2} description="Make predictions on upcoming football matches." />
            <HowItWorksStep number={3} description="Compete in the rankings and answer social questions." />
          </div>
        </div>
      </section>

      {/* Email Signup Form */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold">Get notified when we launch!</h2>
          <div className="mt-4 flex items-center justify-center">
            <Input type="email" placeholder="Enter your email" className="w-full md:w-auto max-w-md rounded-l-md" />
            <Button className="rounded-l-none rounded-r-md" >
              <Mail className="mr-2 h-4 w-4" />
              Notify Me
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Offside Club. All rights reserved.</p>
      </footer>
    </div>
  );
}
