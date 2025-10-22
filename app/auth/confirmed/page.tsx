'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic'

export default function ConfirmedPage() {
  const router = useRouter();

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-uber-xl text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-black">
            Email Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              Your account has been successfully confirmed.
            </p>
            <p className="text-gray-600 text-sm">
              You can now log in and start discovering amazing app ideas!
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <Button size="lg" className="w-full">
                Go to Login
              </Button>
            </Link>

            <p className="text-xs text-gray-500">
              Redirecting automatically in 5 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
