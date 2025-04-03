import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi girin"),
  password: z
    .string()
    .nonempty("Şifre gereklidir")
    .min(6, "Şifre en az 6 karakter olmalıdır")
    // .max(32, "Şifre en fazla 32 karakter olmalıdır")
    // .regex(/[a-zA-Z]/, "Şifre en az bir harf içermelidir")
    // .regex(/[0-9]/, "Şifre en az bir rakam içermelidir")
    // .regex(/[@$!%*?&]/, "Şifre en az bir özel karakter içermelidir")
    ,
});

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;