"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link";
import { loginFormSchema, type LoginFormSchemaType } from "../validations/login-form-schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { container } from "tsyringe";
import { IAuthService } from "@/services/auth/IAuthService";
import { LoginRequest } from "../models/LoginRequest";



export function LoginForm(){

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

    const form = useForm<LoginFormSchemaType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const authService = container.resolve<IAuthService>("AuthService");

    async function onSubmit(values: LoginFormSchemaType) {
        setIsLoading(true)
        setError(null)
    
        try {
            const request:LoginRequest = {
                email: values.email,
                password: values.password
            }
            const result = await authService.loginAsync(request);
            
            if(result.success){
                console.log("Giriş başarılı:", values);

                toast.success("Giriş başarılı", {
                    description: "Yönlendiriliyorsunuz...",
                    action: {
                        label: "Tamam",
                        onClick: () => {
                        // Yönlendirme işlemi
                        router.push("/dashboard")
                        },
                    },
                })
            }else{
                setError(result.message);
            }


        // const response = await fetch("https://api.obisis.com/v1/auth/login", {
        //     method: "POST",
        //     headers: {
        //     "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //     email: values.email,
        //     password: values.password,
        //     }),
        // })

        // const data = await response.json()

        // if (!response.ok) {
        //     throw new Error(data.message || "Giriş sırasında bir hata oluştu")
        // }
        

        //   // Token'ı localStorage veya cookie'de saklama
        //   if (values.rememberMe) {
        //     localStorage.setItem("authToken", data.token)
        //   } else {
        //     sessionStorage.setItem("authToken", data.token)
        //   }

        // Ana sayfaya yönlendirme
        //router.push("/dashboard")
        } catch (err) {
            console.error("Giriş hatası:", err)
            setError(err instanceof Error ? err.message : "Giriş sırasında bir hata oluştu")
        } finally {
            setIsLoading(false)
        }   
}


const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  


    return (
        <>  
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="email">E-posta</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="E-posta adresi"
                                    autoComplete="email"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="password">
                                    Şifre
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Şifremi unuttum?
                                    </Link>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Şifre"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <Button 
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={toggleShowPassword}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                                            </span>
                                        </Button>
                                    </div>
                                    
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş yapılıyor...
                    </>
                    ) : (
                        "Giriş Yap"
                    )}
                </Button>
              
            </form>
        </Form>
 
        <div className="text-center text-sm">
          Hesabınız yok mu?{" "}
          <a 
            href="/register" 
            className="text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
          >
            Kayıt ol
          </a>
        </div>
        </>
        
    )

}

// export function LoginForm({
//     className,
//     ...props
// }: React.ComponentPropsWithoutRef<"form">) {
//     return (
        
//         // <form className={cn("flex flex-col gap-6", className)} {...props}>
//         //     <div className="grid gap-6">
//         //         <div className="grid gap-2">
//         //             <Label htmlFor="email">E-posta</Label>
//         //             <Input id="email" type="email" placeholder="e-posta adresi" required />
//         //         </div>
//         //         <div className="grid gap-2">
//         //             <div className="flex items-center">
//         //                 <Label htmlFor="password">Şifre</Label>
//         //                 <a
//         //                     href="#"
//         //                     className="ml-auto text-sm underline-offset-4 hover:underline"
//         //                 >
//         //                     Şifremi unuttum?
//         //                 </a>
//         //             </div>
//         //             <Input 
//         //             id="password" 
//         //             type="password"
//         //             placeholder="Şifre"
//         //             required />
//         //         </div>
//         //         <Button type="submit" className="w-full">
//         //             Giriş yap
//         //         </Button>
//         //         <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//         //             <span className="relative z-10 bg-background px-2 text-muted-foreground">
//         //                 Ya da aşağıdan devam edin
//         //             </span>
//         //         </div>
//         //         <Button variant="outline" className="w-full">
//         //             <svg
//         //                 className="h-5 w-5"
//         //                 viewBox="0 0 24 24"
//         //                 xmlns="http://www.w3.org/2000/svg"
//         //             >
//         //                 <path
//         //                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//         //                     fill="#4285F4"
//         //                 />
//         //                 <path
//         //                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//         //                     fill="#34A853"
//         //                 />
//         //                 <path
//         //                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//         //                     fill="#FBBC05"
//         //                 />
//         //                 <path
//         //                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//         //                     fill="#EA4335"
//         //                 />
//         //             </svg>

//         //             Google ile devam et
//         //         </Button>
//         //     </div>
//         //     <div className="text-center text-sm">
//         //         Hesabınız yok mu?{" "}
//         //         <a href="/register" className="underline underline-offset-4">
//         //             Hesap oluştur
//         //         </a>
//         //     </div>
//         // </form>
//     )
// }
