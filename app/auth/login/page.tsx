'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IdeatorLogo } from '@/components/IdeatorLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success(t('toast.loggedIn'))
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error(t('toast.failed').replace('{action}', 'login'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-uber-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <IdeatorLogo size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t('auth.login')}</CardTitle>
          <CardDescription>
            {t('auth.enterEmail')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('auth.email')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t('auth.password')}
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth.loggingIn') : t('auth.login')}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link href="/auth/signup" className="text-black font-medium hover:underline">
                {t('auth.signup')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
