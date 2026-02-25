"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Bell, Lock, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ParametresPage() {
  const [notifDemandes, setNotifDemandes] = useState(true);
  const [notifAvis, setNotifAvis] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const saveNotifications = async () => {
    setSaving(true);
    try {
      await fetch("/api/prestataires/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifNouvellesDemandes: notifDemandes,
          notifNouveauxAvis: notifAvis,
        }),
      });
      toast({ title: "Préférences sauvegardées" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) {
      toast({ title: "8 caractères minimum", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Mot de passe mis à jour" });
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/users/compte", { method: "DELETE" });
      if (!res.ok) throw new Error();
      await signOut({ callbackUrl: "/" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer le compte", variant: "destructive" });
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#1a1a2e]">Paramètres</h1>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-amber-500" />
          <h2 className="font-display font-bold text-[#1a1a2e]">Notifications email</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-[#1a1a2e]">Nouvelles demandes de devis</p>
              <p className="text-xs text-gray-400">Recevez un email à chaque nouvelle demande</p>
            </div>
            <button onClick={() => setNotifDemandes(!notifDemandes)} aria-label="Toggle notif demandes">
              {notifDemandes ? (
                <ToggleRight className="w-9 h-9 text-green-500" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-gray-300" />
              )}
            </button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-[#1a1a2e]">Nouveaux avis</p>
              <p className="text-xs text-gray-400">Recevez un email quand un client laisse un avis</p>
            </div>
            <button onClick={() => setNotifAvis(!notifAvis)} aria-label="Toggle notif avis">
              {notifAvis ? (
                <ToggleRight className="w-9 h-9 text-green-500" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        <Button
          onClick={saveNotifications}
          disabled={saving}
          className="mt-6 bg-amber-500 hover:bg-amber-600 text-white"
          size="sm"
        >
          {saving && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          Sauvegarder
        </Button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-amber-500" />
          <h2 className="font-display font-bold text-[#1a1a2e]">Changer le mot de passe</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Nouveau mot de passe</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Au moins 8 caractères"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Confirmer le mot de passe</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              className="mt-1"
            />
          </div>
          <Button onClick={changePassword} variant="outline" size="sm">
            Mettre à jour le mot de passe
          </Button>
        </div>
      </div>

      {/* Delete account */}
      <div className="bg-white rounded-2xl shadow-card p-6 border border-red-100">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h2 className="font-display font-bold text-red-600">Supprimer le compte</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Cette action est irréversible. Toutes vos données seront supprimées définitivement.
        </p>
        <Button
          onClick={deleteAccount}
          disabled={deleting}
          variant="outline"
          className="border-red-200 text-red-500 hover:bg-red-50"
          size="sm"
        >
          {deleting && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          Supprimer mon compte
        </Button>
      </div>
    </div>
  );
}
