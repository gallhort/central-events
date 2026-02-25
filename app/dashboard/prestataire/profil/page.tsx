"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Plus, X, Upload, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nomEntreprise: z.string().min(2, "Nom requis"),
  description: z.string().max(2000).optional(),
  categorie: z.string().min(1, "Catégorie requise"),
  ville: z.string().min(1, "Ville requise"),
  zoneIntervention: z.string().optional(),
  prixMin: z.coerce.number().min(0).optional(),
  prixMax: z.coerce.number().min(0).optional(),
  siteWeb: z.string().url("URL invalide").optional().or(z.literal("")),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  disponible: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const CATEGORIES = [
  { value: "traiteur", label: "Traiteur" },
  { value: "photographe", label: "Photographe" },
  { value: "dj", label: "DJ / Animation" },
  { value: "salle", label: "Salle de réception" },
  { value: "fleuriste", label: "Fleuriste" },
  { value: "videaste", label: "Vidéaste" },
  { value: "sono", label: "Sono / Lumière" },
  { value: "autre", label: "Autre" },
];

export default function ProfilPrestatairePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomEntreprise: "",
      description: "",
      categorie: "autre",
      ville: "",
      zoneIntervention: "",
      prixMin: undefined,
      prixMax: undefined,
      siteWeb: "",
      instagram: "",
      whatsapp: "",
      disponible: true,
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/prestataires/profil");
        if (!res.ok) return;
        const data = await res.json();
        form.reset({
          nomEntreprise: data.nomEntreprise,
          description: data.description ?? "",
          categorie: data.categorie,
          ville: data.ville,
          zoneIntervention: data.zoneIntervention ?? "",
          prixMin: data.prixMin ?? undefined,
          prixMax: data.prixMax ?? undefined,
          siteWeb: data.siteWeb ?? "",
          instagram: data.instagram ?? "",
          whatsapp: data.whatsapp ?? "",
          disponible: data.disponible,
        });
        setServices(data.services ?? []);
        setPhotos(data.photos ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/prestataires/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, services, photos }),
      });

      if (!res.ok) throw new Error("Erreur");
      toast({ title: "Profil mis à jour", description: "Vos modifications ont été sauvegardées." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder", variant: "destructive" });
    }
  };

  const addService = () => {
    const trimmed = newService.trim();
    if (trimmed && !services.includes(trimmed) && services.length < 15) {
      setServices([...services, trimmed]);
      setNewService("");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (photos.length + files.length > 5) {
      toast({ title: "Maximum 5 photos", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        setPhotos((prev) => [...prev, url]);
      }
    } catch {
      toast({ title: "Erreur upload", description: "Impossible d'uploader la photo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const disponible = form.watch("disponible");

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">Mon profil public</h1>
        <p className="text-gray-500 mt-1">Ces informations apparaissent sur votre fiche prestataire</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
            <h2 className="font-display font-bold text-[#1a1a2e] mb-2">Informations générales</h2>

            <FormField
              control={form.control}
              name="nomEntreprise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'entreprise *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Décrivez vos services, votre expérience, ce qui vous distingue..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categorie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville *</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="zoneIntervention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone d'intervention</FormLabel>
                  <FormControl>
                    <Input placeholder="Île-de-France, France entière..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display font-bold text-[#1a1a2e] mb-4">Tarifs indicatifs</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prixMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix minimum (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prixMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix maximum (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display font-bold text-[#1a1a2e] mb-4">Services proposés</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {services.map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="flex items-center gap-1 bg-amber-50 text-amber-700 border-0"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => setServices(services.filter((s) => s !== service))}
                    aria-label={`Supprimer ${service}`}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un service..."
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                className="flex-1"
              />
              <Button type="button" onClick={addService} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display font-bold text-[#1a1a2e] mb-4">
              Photos ({photos.length}/5)
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {photos.map((photo, i) => (
                <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                    aria-label="Supprimer la photo"
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <label className="w-24 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">Ajouter</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
            <h2 className="font-display font-bold text-[#1a1a2e] mb-2">Liens & Contact</h2>
            <FormField
              control={form.control}
              name="siteWeb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://monsite.fr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="@monentreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="+33 6 xx xx xx xx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-[#1a1a2e]">Disponibilité</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {disponible ? "Vous êtes disponible pour de nouvelles demandes" : "Vous n'êtes pas disponible"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => form.setValue("disponible", !disponible)}
                aria-label={disponible ? "Désactiver la disponibilité" : "Activer la disponibilité"}
              >
                {disponible ? (
                  <ToggleRight className="w-10 h-10 text-green-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Sauvegarder le profil
          </Button>
        </form>
      </Form>
    </div>
  );
}
