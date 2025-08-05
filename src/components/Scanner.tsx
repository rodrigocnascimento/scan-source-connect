import { useRef, useEffect, useState, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanLine, Camera, X, FlashlightIcon as Flash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScannerProps {
  onScanResult: (result: string) => void;
  onClose: () => void;
}

const Scanner = ({ onScanResult, onClose }: ScannerProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const navigate = useNavigate();

  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    // Check if torch is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints) {
      const constraints = navigator.mediaDevices.getSupportedConstraints();
      setTorchSupported('torch' in constraints);
    }
  }, []);

  const startScanning = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsScanning(true);
    setError(null);

    try {
      const videoElement = webcamRef.current.video;
      if (!videoElement) return;

      const result = await reader.current.decodeOnceFromVideoDevice(undefined, videoElement);
      if (result) {
        onScanResult(result.getText());
        setIsScanning(false);
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError('Erro ao escanear. Tente novamente.');
      setIsScanning(false);
    }
  }, [onScanResult]);

  const toggleTorch = useCallback(async () => {
    if (!webcamRef.current?.stream) return;

    try {
      const track = webcamRef.current.stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchEnabled } as any]
        });
        setTorchEnabled(!torchEnabled);
      }
    } catch (err) {
      console.error('Torch error:', err);
    }
  }, [torchEnabled]);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment' // Use back camera
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm">
        <h1 className="text-lg font-semibold">Escanear Código</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          screenshotFormat="image/jpeg"
        />
        
        {/* Scanner Overlay */}
        <div className="absolute inset-0 bg-black/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64 border-2 border-scanner-frame rounded-2xl">
              {/* Corner indicators */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-scanner-frame rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-scanner-frame rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-scanner-frame rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-scanner-frame rounded-br-lg" />
              
              {/* Scanning line */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-scanner-success scan-line" />
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 px-6">
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <div className="p-4 text-center">
              <ScanLine className="h-6 w-6 mx-auto mb-2 text-scanner-frame" />
              <p className="text-sm text-muted-foreground">
                Posicione o código de barras dentro da moldura
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-6">
          {torchSupported && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTorch}
              className={`rounded-full h-12 w-12 ${torchEnabled ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Flash className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            onClick={startScanning}
            disabled={isScanning}
            className="rounded-full h-16 w-16 bg-gradient-primary shadow-scanner"
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
        
        {error && (
          <p className="text-destructive text-sm text-center mt-4">{error}</p>
        )}
        
        {isScanning && (
          <p className="text-scanner-success text-sm text-center mt-4">
            Escaneando...
          </p>
        )}
      </div>
    </div>
  );
};

export default Scanner;