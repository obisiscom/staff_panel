import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { RegisterForm } from "@/features/auth/forms/register-form"
import { ModeToggle } from "@/features/theme/mode-toggle"
import { APP_CONSTANTS } from "@/constants"

export const metadata: Metadata = {
    title: "Yeni bir hesap oluşturun"
}

export default function AuthenticationPage() {
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
                            <Link href="/login">
                                Üye girişi
                            </Link>
                        </Button>
                    </div>

                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] p-8 sm:p-0">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold">Bir hesap oluşturun</h1>
                            <p className="text-sm text-muted-foreground">Hesabınızı oluşturmak için aşağıya e-postanızı girin</p>
                        </div>
                        <RegisterForm />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            Devam'a tıklayarak, {" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Hizmet Şartları
                            </Link>{" "}
                            ve{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Gizlilik Politikamızı
                            </Link>{" "}
                            kabul etmiş olursunuz.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}