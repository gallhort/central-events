"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, Calendar, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Au moins 8 caractères"),
  role: z.enum(["ORGANISATEUR", "PRESTATAIRE"]),
});

type FormData = z.infer<typeof formSchema>;

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const defaultRole = searchParams.get("role") === "prestataire" ? "PRESTATAIRE" : "ORGANISATEUR";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", role: defaultRole },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: "Erreur",
          description: result.error ?? "Une erreur est survenue",
          variant: "destructive",
        });
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/auth/connexion");
        return;
      }

      const dashboardUrl =
        data.role === "PRESTATAIRE" ? "/dashboard/prestataire" : "/dashboard/organisateur";
      router.push(dashboardUrl);
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    }
  };

  const role = form.watch("role");

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-1 mb-8">
          <span className="font-display text-2xl font-bold text-[#1a1a2e]">Central</span>
          <span className="font-display text-2xl font-bold text-amber-500">Events</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h1 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Gratuit pour commencer, sans carte bancaire
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["ORGANISATEUR", "PRESTATAIRE"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => form.setValue("role", r)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  role === r
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {r === "ORGANISATEUR" ? (
                  <Calendar className={cn("w-5 h-5 mb-2", role === r ? "text-amber-500" : "text-gray-400")} />
                ) : (
                  <Building2 className={cn("w-5 h-5 mb-2", role === r ? "text-amber-500" : "text-gray-400")} />
                )}
                <p className={cn("text-sm font-semibold", role === r ? "text-amber-700" : "text-[#1a1a2e]")}>
                  {r === "ORGANISATEUR" ? "Organisateur" : "Prestataire"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {r === "ORGANISATEUR" ? "Je cherche des prestataires" : "Je propose mes services"}
                </p>
              </button>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {role === "PRESTATAIRE" ? "Nom de l'entreprise" : "Nom complet"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={role === "PRESTATAIRE" ? "Mon Entreprise SARL" : "Jean Dupont"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="vous@exemple.fr" {...field} />
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
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Au moins 8 caractères"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Masquer" : "Afficher"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer mon compte gratuitement"
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                En créant un compte, vous acceptez nos{" "}
                <Link href="/cgu" className="underline hover:text-amber-600">CGU</Link>{" "}
                et notre{" "}
                <Link href="/confidentialite" className="underline hover:text-amber-600">
                  politique de confidentialité
                </Link>
              </p>
            </form>
          </Form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link href="/auth/connexion" className="text-amber-600 hover:text-amber-700 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense>
      <InscriptionForm />
    </Suspense>
  );
}
