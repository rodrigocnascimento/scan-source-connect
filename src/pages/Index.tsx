import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Scanner from '@/components/Scanner';
import { useNavigate } from 'react-router-dom';
import { 
  ScanLine, 
  Package, 
  History, 
  Settings,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const Index = () => {
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleScanResult = (barcode: string) => {
    setShowScanner(false);
    navigate(`/product/${barcode}`);
  };

  const recentScans = [
    { barcode: '7891000100103', name: 'Leite Condensado Nestlé', country: '🇧🇷 Brasil' },
    { barcode: '7894900011517', name: 'Biscoito Trakinas', country: '🇧🇷 Brasil' },
    { barcode: '7622210951885', name: 'Kit Kat', country: '🇧🇷 Brasil' },
  ];

  if (showScanner) {
    return (
      <Scanner 
        onScanResult={handleScanResult}
        onClose={() => setShowScanner(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              CodeScan
            </h1>
            <p className="text-muted-foreground">
              Descubra a origem dos produtos
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card className="bg-gradient-card shadow-card-modern">
            <div className="p-4 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-medium">Escaneamento Rápido</p>
            </div>
          </Card>
          
          <Card className="bg-gradient-card shadow-card-modern">
            <div className="p-4 text-center">
              <div className="w-10 h-10 bg-scanner-success/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Globe className="h-5 w-5 text-scanner-success" />
              </div>
              <p className="text-xs font-medium">País de Origem</p>
            </div>
          </Card>
          
          <Card className="bg-gradient-card shadow-card-modern">
            <div className="p-4 text-center">
              <div className="w-10 h-10 bg-scanner-warning/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-scanner-warning" />
              </div>
              <p className="text-xs font-medium">Info Verificada</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Main Scan Button */}
        <Card className="bg-gradient-card shadow-card-modern border-primary/20">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-scanner">
                <ScanLine className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Escanear Código de Barras
              </h2>
              <p className="text-muted-foreground text-sm">
                Aponte a câmera para o código de barras e descubra informações detalhadas sobre o produto
              </p>
            </div>
            
            <Button 
              onClick={() => setShowScanner(true)}
              className="w-full h-14 text-lg rounded-2xl bg-gradient-primary shadow-scanner hover:scale-[1.02] transition-transform"
            >
              <ScanLine className="h-5 w-5 mr-2" />
              Iniciar Escaneamento
            </Button>
          </div>
        </Card>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5" />
                Escaneamentos Recentes
              </h3>
              <Button variant="ghost" size="sm" className="text-primary">
                Ver todos
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <Card 
                  key={index}
                  className="bg-gradient-card shadow-card-modern hover:scale-[1.02] transition-transform cursor-pointer"
                  onClick={() => navigate(`/product/${scan.barcode}`)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {scan.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {scan.country}
                      </p>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {scan.barcode}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="space-y-4 pb-8">
          <Card className="bg-gradient-card shadow-card-modern border-scanner-success/20">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-scanner-success/10 rounded-xl flex items-center justify-center mt-1">
                  <Globe className="h-5 w-5 text-scanner-success" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Origem Verificada</h4>
                  <p className="text-sm text-muted-foreground">
                    Descubra o país de origem e informações confiáveis sobre os produtos que você consome.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card shadow-card-modern border-primary/20">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mt-1">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Dados Seguros</h4>
                  <p className="text-sm text-muted-foreground">
                    Todas as informações são obtidas de fontes confiáveis e verificadas para garantir precisão.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
