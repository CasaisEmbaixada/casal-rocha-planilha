import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Camera, Save, LogOut, Trash2, Sun, Moon, Monitor, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PushNotifications } from "./PushNotifications";
import { NotificationTester } from "./NotificationTester";

interface Profile {
  id: string;
  user_id: string;
  family_name: string;
  photo_url?: string;
  full_name?: string;
  email?: string;
  whatsapp?: string;
  street?: string;
  house_number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  postal_code?: string;
  state?: string;
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
        throw new Error('Erro ao carregar perfil do banco de dados');
      }

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
          street: profile.street,
          house_number: profile.house_number,
          complement: profile.complement,
          neighborhood: profile.neighborhood,
          city: profile.city,
          postal_code: profile.postal_code,
          state: profile.state,
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

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem nos formatos: JPEG, PNG, GIF ou WebP",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    
    // Criar preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const cancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile || !profile) return;

    try {
      setUploadingPhoto(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Deletar foto antiga se existir
      if (profile.photo_url) {
        const oldPath = profile.photo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload da nova foto
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar perfil no banco
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Atualizar estado local
      setProfile({ ...profile, photo_url: publicUrl });
      cancelUpload();

      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!"
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer upload da foto",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
    }
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
          {/* Avatar com Upload */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-24 w-24 sm:h-20 sm:w-20">
                <AvatarImage 
                  src={previewUrl || profile.photo_url || undefined} 
                  alt="Foto de perfil"
                />
                <AvatarFallback className="text-lg">
                  {profile.family_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 w-full sm:w-auto">
                {!selectedFile ? (
                  <div className="space-y-2">
                    <Label htmlFor="photo_upload" className="text-sm">
                      Foto de Perfil
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="photo_upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileSelect}
                        className="cursor-pointer file:cursor-pointer"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="whitespace-nowrap"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Escolher
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG, GIF ou WebP. Máx 5MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm">Preview</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        onClick={uploadPhoto}
                        disabled={uploadingPhoto}
                        className="flex-1"
                      >
                        {uploadingPhoto ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Salvar Foto
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelUpload}
                        disabled={uploadingPhoto}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
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

      {/* Notificações Push */}
      <PushNotifications />

      {/* Enviar Notificação de Teste */}
      <NotificationTester />

      {/* Informações de Endereço */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>
            Informações de localização da família
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                placeholder="Nome da rua"
                value={profile.street || ''}
                onChange={(e) => setProfile({ ...profile, street: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="house_number">Número</Label>
              <Input
                id="house_number"
                placeholder="123"
                value={profile.house_number || ''}
                onChange={(e) => setProfile({ ...profile, house_number: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto, bloco, etc."
                value={profile.complement || ''}
                onChange={(e) => setProfile({ ...profile, complement: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                placeholder="Nome do bairro"
                value={profile.neighborhood || ''}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Nome da cidade"
                value={profile.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">CEP</Label>
              <Input
                id="postal_code"
                placeholder="00000-000"
                value={profile.postal_code || ''}
                onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="UF"
                value={profile.state || ''}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Endereço'}
          </Button>
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
                <br/><br/>
                <strong>⚠️ Atenção:</strong> Ao deletar sua conta, todos os dados serão perdidos permanentemente e não há como recuperá-los.
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