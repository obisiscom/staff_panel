'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface Language {
  locale: string;
  name: string;
  flag: string;
}

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<string>('tr');
  
  // Desteklenen diller
  const languages: Language[] = [
    { locale: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { locale: 'en', name: 'English', flag: '🇬🇧' }
  ];

  // Geçerli locale'i belirle
  useEffect(() => {
    // URL'den locale'i tespit et
    const pathSegments = pathname.split('/');
    const localeFromPath = pathSegments[1];
    
    if (locales.includes(localeFromPath as any)) {
      setCurrentLocale(localeFromPath);
    } else {
      // Tarayıcı dilini kontrol et
      const browserLang = navigator.language.split('-')[0];
      setCurrentLocale(locales.includes(browserLang as any) ? browserLang : 'tr');
    }
  }, [pathname]);

  // Geçerli dilin bilgilerini bul
  const currentLanguage = languages.find(lang => lang.locale === currentLocale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 px-3">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="inline-block sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <Link
            key={language.locale}
            href={pathname}
            locale={language.locale}
            legacyBehavior
            passHref
          >
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2"
              asChild
            >
              <a>
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
                {currentLocale === language.locale && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </a>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}