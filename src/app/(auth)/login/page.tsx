import { Button } from "@/components/ui/button";
import { APP_CONSTANTS } from "@/constants";
import { LoginForm } from "@/features/auth/forms/login-form";
import { ModeToggle } from "@/features/theme/mode-toggle";
import { Metadata } from "next";
import Link from "next/link";

export const metadata:Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
    return (
      <>
      <div className="grid min-h-svh lg:grid-cols-2">
          <div className="hidden lg:flex flex-col p-6 md:p-10 bg-emerald-700 dark:bg-emerald-950 text-white">
              <div className="relative z-20 text-2xl font-bold">
                  {APP_CONSTANTS.BRAND}
              </div>

          </div>
          <div className="flex flex-1 items-center justify-center relative">


              <div className="absolute top-4 right-4 flex gap-2">
                  <ModeToggle />
                  <Button variant="ghost" asChild>
                      <Link href="/register">
                          Hesap oluştur
                      </Link>
                  </Button>
              </div>

              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] p-8 sm:p-0">
                  <div className="flex flex-col space-y-2 text-center">
                      <h1 className="text-2xl font-semibold">Hesabınıza giriş yapın</h1>
                      <p className="text-sm text-muted-foreground">Hesabınıza giriş yapmak için aşağıya e-postanızı girin</p>
                  </div>
                  <LoginForm />
                  
              </div>
          </div>
      </div>
  </>
      );
}