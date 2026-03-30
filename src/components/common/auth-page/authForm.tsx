"use client"

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/contexts/I18nContext'
import LanguageSwitcher from '@/components/common/language-switcher'

const AuthForm: React.FC = () => {
  const { signIn, signUp } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const { error } = await signIn(loginEmail, loginPassword)
    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      toast.success(t('auth.welcomeBack'))
      router.push('/cv-builder')
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (signUpPassword !== signUpConfirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }

    if (signUpPassword.length < 6) {
      setError(t('auth.passwordLength'))
      return
    }

    setIsLoading(true)
    const { error } = await signUp(signUpEmail, signUpPassword)
    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      toast.success(t('auth.accountCreated'))
      router.push('/cv-builder')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-auth p-4">
      <Card className="w-full max-w-md shadow-elegant glass-effect animate-scaleIn">
        <CardHeader className="text-center space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-background">
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('common.backHome')}
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>
          <div className="flex justify-center">
            <div className="p-3 rounded-xl gradient-primary text-white transform-3d">
              <FileText className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('common.appName')}</CardTitle>
          <CardDescription>
            {t('auth.subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('common.login')}</TabsTrigger>
              <TabsTrigger value="signup">{t('common.signUp')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4 animate-fadeIn">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('common.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('common.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary hover:gradient-primary-hover transition-elegant" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {t('auth.signIn')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4 animate-fadeIn">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('common.email')}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('common.password')}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">{t('common.confirmPassword')}</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gradient-primary hover:gradient-primary-hover transition-elegant" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {t('auth.createAccount')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4 animate-fadeIn">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthForm