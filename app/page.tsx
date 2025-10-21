import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold">
          Find Your Next App Idea
        </h1>
        <p className="text-xl text-gray-400">
          Discover app ideas tailored to your interests and skills
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">Login</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
