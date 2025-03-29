import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { title } from "process";
import { deserialize } from "v8";
import { LoginForm } from "@/features/auth/forms/LoginForm";


export const metadata:Metadata = {
    title:'Giriş yap',
    description:'Giriş yapın',
}

export default function LoginPage({
    params:{ locale },
    searchParams
}: {
    params: { locale: string };
    searchParams: { callbackUrl?: string };
}) {

    const callbackUrl = searchParams.callbackUrl || '/dashboard';
    const t = useTranslations('auth');


    return (
        <div className="min-h-screen flex flex-col bg-background">
          <header className="py-4 px-6 border-b">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" locale={locale} className="flex items-center gap-2">
                <Image
                  src="/next.svg"
                  alt="Logo"
                  width={100}
                  height={24}
                  className="dark:invert"
                />
                <span className="text-lg font-semibold">Staff Panel</span>
              </Link>
              
              <div className="flex items-center gap-3">
                {/* Tema değiştirme */}
                <ThemeToggle />
                
                {/* Dil değiştirme dropdown'ı */}
                <LanguageSwitcher />
              </div>
            </div>
          </header>
    
          <main className="flex-1 grid place-items-center p-6 md:p-12">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="hidden md:flex flex-col space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Staff Panel</h1>
                  <p className="text-muted-foreground">
                    {t('login.welcomeMessage', { 
                      defaultValue: 'Personel yönetim sistemine hoş geldiniz. Giriş yaparak devam edin.' 
                    })}
                  </p>
                </div>
                <div className="relative aspect-square max-w-md">
                  <Image
                    src="/vercel.svg"
                    alt={t('login.illustration', { defaultValue: 'Login illustration' })}
                    fill
                    className="object-contain dark:invert"
                    priority
                  />
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <LoginForm callbackUrl={callbackUrl} />
              </div>
            </div>
          </main>
    
          <footer className="py-4 px-6 border-t">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Staff Panel. {t('login.copyright', { defaultValue: 'Tüm hakları saklıdır.' })}
            </div>
          </footer>
        </div>
      );
}