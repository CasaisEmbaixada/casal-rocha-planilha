import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Camera, Save, LogOut, Trash2, Sun, Moon, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  family_name: string;
  photo_url?: string;
  full_name?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  theme_preference: 'light' | 'dark' | 'system';
}

interface SettingsSectionProps {
  onLogout: () => void;
  familyName?: string;
}

export const SettingsSection = ({ onLogout, familyName = "Família" }: SettingsSectionProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuário não encontrado');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          ...data,
          theme_preference: (data.theme_preference as 'light' | 'dark' | 'system') || 'system'
        });
      } else {
        // Criar perfil inicial se não existir
        const newProfile = {
          user_id: user.id,
          family_name: familyName,
          theme_preference: 'system' as const
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile({
          ...createdProfile,
          theme_preference: (createdProfile.theme_preference as 'light' | 'dark' | 'system') || 'system'
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          family_name: profile.family_name,
          full_name: profile.full_name,
          email: profile.email,
          whatsapp: profile.whatsapp,
          address: profile.address,
          theme_preference: profile.theme_preference
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!"
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o perfil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    try {
      // Primeiro desconecta o usuário
      await supabase.auth.signOut();
      
      toast({
        title: "Conta desconectada",
        description: "Entre em contato com o suporte para excluir permanentemente sua conta"
      });
      
      onLogout();
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar da conta",
        variant: "destructive"
      });
    }
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    if (!profile) return;
    
    setProfile({ ...profile, theme_preference: theme });
    applyTheme(theme);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Não foi possível carregar o perfil</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações do Perfil */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informações do Perfil</span>
          </CardTitle>
          <CardDescription>
            Gerencie as informações da sua família
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.photo_url} />
              <AvatarFallback className="text-lg">
                {profile.family_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="photo_url">Foto da Família</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="photo_url"
                  placeholder="URL da foto"
                  value={profile.photo_url || ''}
                  onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
                />
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="family_name">Nome da Família</Label>
              <Input
                id="family_name"
                value={profile.family_name}
                onChange={(e) => setProfile({ ...profile, family_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="(11) 99999-9999"
                value={profile.whatsapp || ''}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              placeholder="Digite seu endereço completo"
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>

          <Button onClick={saveProfile} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardContent>
      </Card>

      {/* Preferências de Tema */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Escolha como deseja visualizar a aplicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Tema</Label>
            <Select 
              value={profile.theme_preference} 
              onValueChange={(value: 'light' | 'dark' | 'system') => handleThemeChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Modo Claro</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span>Modo Escuro</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span>Sistema</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ações da Conta */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Gerenciar Conta</CardTitle>
          <CardDescription>
            Ações relacionadas à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={onLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da Conta
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá desconectar sua conta. Para excluir permanentemente sua conta
                  e todos os dados, entre em contato com o suporte.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={deleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Desconectar Conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};