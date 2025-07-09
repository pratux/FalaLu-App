import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Smartphone, Download, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registrado com sucesso:', registration.scope);
          })
          .catch((error) => {
            console.log('Falha ao registrar ServiceWorker:', error);
          });
      });
    }

    // Detectar se já está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isInWebAppChrome = window.matchMedia('(display-mode: minimal-ui)').matches;
      
      const installed = isStandalone || isInWebAppiOS || isInWebAppChrome;
      console.log('App instalado:', installed);
      setIsInstalled(installed);
      
      return installed;
    };

    if (checkIfInstalled()) {
      return; // Se já está instalado, não precisa configurar o prompt
    }

    // Prompt de instalação PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Detectar se o navegador suporta instalação
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar quando o app é instalado
    window.addEventListener('appinstalled', () => {
      console.log('App foi instalado');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    // Para navegadores que não disparam o evento imediatamente
    const checkInstallability = () => {
      if (!checkIfInstalled() && 'serviceWorker' in navigator && 'PushManager' in window) {
        setIsInstallable(true);
      }
    };

    // Verificar após um delay
    setTimeout(checkInstallability, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallPWA = async () => {
    console.log('Tentando instalar PWA...');
    
    if (deferredPrompt) {
      console.log('Usando deferredPrompt');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        toast({
          title: "App instalado!",
          description: "Agora você pode acessar o Fala Lu diretamente da sua tela inicial.",
        });
        // O evento 'appinstalled' será disparado automaticamente
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // Instruções específicas para Android
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isChrome = /Chrome/i.test(navigator.userAgent);
      const isFirefox = /Firefox/i.test(navigator.userAgent);
      
      let instructions = "Use o menu do seu navegador para instalar o app.";
      
      if (isAndroid) {
        if (isChrome) {
          instructions = "No Chrome: Toque nos 3 pontos (⋮) no canto superior direito → 'Instalar app' ou 'Adicionar à tela inicial'";
        } else if (isFirefox) {
          instructions = "No Firefox: Toque nos 3 pontos (⋮) → 'Instalar' ou procure pelo ícone de instalação na barra de endereços";
        } else {
          instructions = "Procure por 'Adicionar à tela inicial' ou 'Instalar app' no menu do navegador (⋮)";
        }
      }
      
      toast({
        title: "Como instalar o app",
        description: instructions,
        duration: 8000,
      });
    }
  };

  // Não mostrar o botão se o app já estiver instalado
  const shouldShowInstallButton = !isInstalled && (isInstallable || deferredPrompt);

  return (
    <div className="min-h-screen bg-rastelli-bg bg-cover bg-center bg-fixed flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Principal - Mobile First */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl animate-slide-up md:animate-fade-in">
          <div className="p-6 md:p-8 text-center">
            {/* Logo Rastelli */}
            <div className="mb-6">
              <img 
                src="/lovable-uploads/9c388be9-72df-469d-aaa1-deaef2220acb.png" 
                alt="Logo Rastelli" 
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
            </div>

            {/* Título e Avatar */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-rastelli-primary">
                <img 
                  src="/lovable-uploads/456ff2cc-13d0-4953-bf21-3672ec7449cc.png" 
                  alt="Avatar Lu" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-playfair text-2xl md:text-3xl font-bold text-rastelli-primary">
                  Fala Lu
                </h1>
              </div>
            </div>

            <p className="text-gray-600 mb-6 font-inter">
              Seu consultor financeiro personalizado com a experiência e confiança da Rastelli.
            </p>

            {/* Botão de Instalação PWA - só mostra se não estiver instalado */}
            {shouldShowInstallButton && (
              <Button
                onClick={handleInstallPWA}
                className="w-full mb-6 bg-rastelli-primary hover:bg-rastelli-dark transition-all duration-300 font-inter font-medium"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                {deferredPrompt ? 'Instalar App' : 'Como Instalar App'}
              </Button>
            )}

            {/* Chatbot Iframe */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-rastelli-primary/10 to-transparent rounded-2xl pointer-events-none"></div>
              <iframe
                src="https://www.chatbase.co/chatbot-iframe/Bi6_AlgN623MT1P5DJ8pH"
                className="w-full h-[500px] md:h-[600px] border-0 rounded-2xl shadow-inner"
                title="Fala Lu - Consultora Financeira"
                allow="microphone"
              />
            </div>

            {/* Recursos PWA */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Smartphone className="w-6 h-6 text-rastelli-primary" />
                <span className="text-xs text-gray-600 font-inter">Responsivo</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Download className="w-6 h-6 text-rastelli-primary" />
                <span className="text-xs text-gray-600 font-inter">Instalável</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MessageCircle className="w-6 h-6 text-rastelli-primary" />
                <span className="text-xs text-gray-600 font-inter">Chat IA</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-4">
          <p className="text-white/80 text-sm font-inter">
            © 2024 Rastelli - Consultoria Financeira
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;