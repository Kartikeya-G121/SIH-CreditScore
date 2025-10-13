import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart,
  CheckCircle,
  Database,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Logo } from '@/components/layout/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import heroImage from '@/lib/rupixen-Q59HmzK38eQ-unsplash.jpg';

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Logo />
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="#features"
            className="transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link href="#partners" className="transition-colors hover:text-primary">
            Partners
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">
              Register <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const partners = PlaceHolderImages.filter((img) =>
    img.id.startsWith('partner-')
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="landing-gradient text-white">
          <div className="container grid grid-cols-1 items-center gap-8 py-20 md:grid-cols-2 lg:py-32">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                Empowering India through AI-Driven Credit Scoring.
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-gray-200 md:mx-0">
                Inclusive finance for every entrepreneur and dreamer. Our platform
                radiates trust, inclusivity, and digital empowerment.
              </p>
              <div className="space-x-4">
                <Button size="lg" asChild variant="secondary">
                  <Link href="/register">
                    Get Started <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src={heroImage}
                alt="Smiling woman looking at a phone"
                width={600}
                height={400}
                className="mx-auto overflow-hidden rounded-xl object-cover"
                data-ai-hint="financial empowerment"
                placeholder="blur"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="features" className="w-full bg-muted py-20 lg:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                A Seamless Path to Financial Empowerment
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our innovative 3-step process simplifies credit scoring, making
                it transparent, fair, and accessible for everyone.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">
                    1. Data Integration
                  </CardTitle>
                  <Database className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We securely gather diverse data points to create a holistic
                    financial profile beyond traditional metrics.
                  </p>
                </CardContent>
              </Card>
              <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">
                    2. AI Scoring
                  </CardTitle>
                  <BarChart className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our advanced AI analyzes the data to generate a fair,
                    unbiased composite credit score in real-time.
                  </p>
                </CardContent>
              </Card>
              <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-bold">
                    3. Empowerment
                  </CardTitle>
                  <Users className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Unlock access to fair credit, financial products, and
                    literacy tools to grow your dreams.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Partners Section */}
        <section id="partners" className="py-20 lg:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                Trusted by India&apos;s Leading Institutions
              </h2>
              <p className="mt-4 text-muted-foreground">
                We collaborate with key organizations to drive financial
                inclusion across the nation.
              </p>
            </div>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {partners.map((partner, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1">
                      <Card className="h-32">
                        <CardContent className="flex h-full items-center justify-center p-6">
                          <div className="relative h-16 w-full">
                            <Image
                              src={partner.imageUrl}
                              alt={partner.description}
                              fill
                              className="object-contain"
                              data-ai-hint={partner.imageHint}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted">
          <div className="container flex flex-col items-center justify-between gap-6 py-24 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight">
                Ready to take control of your financial future?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Join thousands of others empowering their lives with fair and
                transparent credit.
              </p>
            </div>
            <Button size="lg" asChild className="flex-shrink-0">
              <Link href="/register">
                Register Now <CheckCircle className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Credit Assist. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
