import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Star, 
  ExternalLink,
  Share2,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  country: string;
  countryFlag: string;
  category: string;
  description: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  price?: string;
  rating?: number;
  image: string;
}

interface SuggestedProduct {
  id: string;
  name: string;
  brand: string;
  country: string;
  countryFlag: string;
  price: string;
  rating: number;
  image: string;
}

// Mock data - em produção viria de uma API
const mockProducts: Record<string, Product> = {
  '7891000100103': {
    id: '1',
    name: 'Leite Condensado',
    brand: 'Nestlé',
    barcode: '7891000100103',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    category: 'Laticínios',
    description: 'Leite condensado tradicional, ideal para sobremesas e receitas doces.',
    ingredients: ['Leite integral', 'Açúcar'],
    nutritionalInfo: {
      calories: '321 kcal/100g',
      protein: '7.8g',
      carbs: '55.4g',
      fat: '8.4g'
    },
    price: 'R$ 4,89',
    rating: 4.5,
    image: '/api/placeholder/300/300'
  },
  'default': {
    id: 'default',
    name: 'Produto Encontrado',
    brand: 'Marca Exemplo',
    barcode: '',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    category: 'Alimentício',
    description: 'Informações do produto serão carregadas...',
    price: 'Consultando...',
    rating: 0,
    image: '/api/placeholder/300/300'
  }
};

const suggestedProducts: SuggestedProduct[] = [
  {
    id: '2',
    name: 'Creme de Leite',
    brand: 'Nestlé',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    price: 'R$ 3,49',
    rating: 4.3,
    image: '/api/placeholder/150/150'
  },
  {
    id: '3',
    name: 'Achocolatado',
    brand: 'Nestlé',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    price: 'R$ 8,99',
    rating: 4.7,
    image: '/api/placeholder/150/150'
  },
  {
    id: '4',
    name: 'Farinha Láctea',
    brand: 'Nestlé',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    price: 'R$ 12,89',
    rating: 4.4,
    image: '/api/placeholder/150/150'
  }
];

const ProductDetails = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Simulate API call
    const foundProduct = mockProducts[barcode || ''] || {
      ...mockProducts.default,
      barcode: barcode || '',
      name: `Produto ${barcode}`
    };
    setProduct(foundProduct);
  }, [barcode]);

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Confira este produto: ${product.name} - ${product.brand}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
      />
    ));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando produto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className="rounded-full"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* Product Image */}
        <div className="relative mb-6">
          <div className="aspect-square bg-card rounded-3xl overflow-hidden shadow-card-modern">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Main Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.brand}
                </p>
              </div>
              {product.price && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {product.price}
                  </p>
                </div>
              )}
            </div>

            {/* Rating */}
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Country - Destaque Principal */}
            <Card className="bg-gradient-card border-product-origin/20 shadow-card-modern">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-product-origin/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-product-origin" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">País de Origem</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{product.countryFlag}</span>
                      <p className="text-lg font-semibold text-product-origin">
                        {product.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full">
                <Package className="h-3 w-3 mr-1" />
                {product.category}
              </Badge>
              <Badge variant="outline" className="rounded-full text-xs">
                {product.barcode}
              </Badge>
            </div>

            {/* Description */}
            <Card className="bg-gradient-card shadow-card-modern">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </Card>

            {/* Nutritional Info */}
            {product.nutritionalInfo && (
              <Card className="bg-gradient-card shadow-card-modern">
                <div className="p-4">
                  <h3 className="font-semibold mb-3">Informações Nutricionais</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Calorias</p>
                      <p className="font-semibold">{product.nutritionalInfo.calories}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Proteínas</p>
                      <p className="font-semibold">{product.nutritionalInfo.protein}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Carboidratos</p>
                      <p className="font-semibold">{product.nutritionalInfo.carbs}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Gorduras</p>
                      <p className="font-semibold">{product.nutritionalInfo.fat}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <Card className="bg-gradient-card shadow-card-modern">
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Ingredientes</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Suggested Products */}
          <div className="space-y-4">
            <Separator />
            <h2 className="text-xl font-bold">Produtos Relacionados</h2>
            <div className="space-y-3">
              {suggestedProducts.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-gradient-card shadow-card-modern hover:scale-[1.02] transition-transform cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {item.brand}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm">{item.countryFlag}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.country}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-primary text-sm">
                            {item.price}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                              {renderStars(item.rating).slice(0, 1)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {item.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comparar
          </Button>
          <Button className="flex-1 rounded-full bg-gradient-primary">
            Ver no Market
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;