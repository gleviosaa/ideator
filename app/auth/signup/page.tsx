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

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { t, language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error(t('toast.passwordsNoMatch'))
      return
    }

    if (password.length < 6) {
      toast.error(t('toast.passwordTooShort'))
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success(t('toast.accountCreated'))
        router.push('/auth/login')
      }
    } catch (error) {
      toast.error(t('toast.failed').replace('{action}', 'signup'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-uber-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1"></div>
            <div className="flex justify-center flex-1">
              <IdeatorLogo size="lg" />
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={toggleLanguage}
                className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                style={{ backgroundColor: language === 'en' ? '#e5e7eb' : '#000000' }}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    language === 'en' ? 'translate-x-1' : 'translate-x-8'
                  }`}
                />
                <span className={`absolute left-1.5 text-xs font-semibold ${language === 'en' ? 'text-black' : 'text-gray-400'}`}>
                  EN
                </span>
                <span className={`absolute right-1.5 text-xs font-semibold ${language === 'tr' ? 'text-white' : 'text-gray-400'}`}>
                  TR
                </span>
              </button>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t('auth.createAccount')}</CardTitle>
          <CardDescription>
            {t('auth.enterInfo')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
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
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                {t('auth.confirmPassword')}
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth.creatingAccount') : t('auth.signup')}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/auth/login" className="text-black font-medium hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
