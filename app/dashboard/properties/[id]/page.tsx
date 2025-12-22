import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Bed, 
  Ruler, 
  Bath, 
  Home,
  Wallet,
  CheckCircle2,
  User,
  FolderOpen
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getPropertyById, getPropertyLeads } from '@/lib/actions/property-actions';
import { getGalleryImages } from '@/lib/actions/image-actions';
import { formatPrice } from '@/lib/utils';
import DocumentsList from '@/components/documents/DocumentsList';
import UploadButton from '@/components/documents/UploadButton';
import { getDocuments } from '@/lib/actions/document-actions';
import { getContacts } from '@/lib/actions/crm-actions';
import PropertyLeads from '@/components/properties/PropertyLeads';
import BackButton from '@/components/SmartBackButton';

// Utilitaire pour les couleurs de statut
const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        available: "bg-green-600 hover:bg-green-700",
        reserved: "bg-orange-500 hover:bg-orange-600",
        sold: "bg-red-600 hover:bg-red-700",
        rented: "bg-blue-600 hover:bg-blue-700"
    };
    const labels: Record<string, string> = {
        available: "Disponible",
        reserved: "Sous offre / Réservé",
        sold: "Vendu",
        rented: "Loué"
    };
    return (
        <Badge className={`${styles[status] || 'bg-gray-500'} text-white px-3 py-1 text-sm`}>
            {labels[status] || status}
        </Badge>
    );
};

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const propertyId = parseInt(id);

  if (isNaN(propertyId)) return notFound();

  // Chargement Parallèle : Infos Bien + Galerie Photos
  const [property, gallery, documents, leads, contactsData] = await Promise.all([
    getPropertyById(propertyId),
    getGalleryImages(propertyId),
    getDocuments('product.template', propertyId),
    getPropertyLeads(propertyId),
    getContacts(1, 1000)
  ]);

  if (!property) return notFound();

  const allImages = gallery.length > 0 ? gallery : [];
  const contactList = contactsData.contacts.map(c => ({ id: c.id, name: c.name }));
  
  // Placeholder si aucune image
  const mainImageSrc = allImages.length > 0 ? allImages[0].src : '/placeholder-house.jpg';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* --- HEADER NAVIGATION --- */}
      <div className="flex justify-between items-center">
        <BackButton label="Retour au portefeuille" href="/dashboard/properties" />
        {/* <Link href="/dashboard/properties">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au portefeuille
          </Button>
        </Link> */}
        <Link href={`/dashboard/properties/${propertyId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" /> Modifier le bien
          </Button>
        </Link>
      </div>

      {/* --- TITRE & STATUS --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="uppercase tracking-wider font-semibold text-primary border-primary/30">
                    {property.type}
                </Badge>
                {getStatusBadge(property.status)}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                {property.name}
            </h1>
            <div className="flex items-center text-muted-foreground text-lg">
                <MapPin className="h-5 w-5 mr-1.5 text-primary" />
                {property.address}, {property.city}
            </div>
        </div>
        <div className="text-right">
            <p className="text-4xl font-bold text-primary">
                {formatPrice(property.price, property.offerType)}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
                {property.offerType === 'À vendre' ? 'Honoraires inclus' : 'Charges comprises'}
            </p>
        </div>
      </div>

      {/* --- GALERIE PHOTOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[450px] rounded-2xl overflow-hidden shadow-sm">
         {/* Grande Image (Moitié gauche ou 3/4) */}
        <div className="md:col-span-2 lg:col-span-3 relative h-full bg-muted">
             <img 
                src={mainImageSrc} 
                alt="Vue principale" 
                className="object-cover w-full h-full hover:scale-105 transition duration-700 ease-in-out" 
             />
        </div>
        
        {/* Colonne latérale (Images 2 et 3) */}
        <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="flex-1 relative bg-muted overflow-hidden">
                {allImages[1] ? (
                    <img src={allImages[1].src} alt="Vue 2" className="object-cover w-full h-full" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <Home className="h-8 w-8 opacity-20" />
                    </div>
                )}
            </div>
            <div className="flex-1 relative bg-muted overflow-hidden">
                {allImages[2] ? (
                    <img src={allImages[2].src} alt="Vue 3" className="object-cover w-full h-full" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <Home className="h-8 w-8 opacity-20" />
                    </div>
                )}
                
                {/* Overlay "+ X photos" */}
                {allImages.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition">
                        <span className="text-white font-bold text-xl">
                            + {allImages.length - 3} photos
                        </span>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        
        {/* --- COLONNE GAUCHE : DÉTAILS (2/3) --- */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Barre de caractéristiques */}
            <div className="flex flex-wrap gap-4 p-6 bg-card border rounded-xl shadow-sm justify-around">
                <div className="flex flex-col items-center gap-1 min-w-20">
                    <Ruler className="h-6 w-6 text-primary mb-1" />
                    <span className="text-xs font-medium text-muted-foreground uppercase">Surface</span>
                    {/* Note: Ajoute x_studio_surface dans getPropertyById pour afficher la vraie valeur */}
                    <span className="text-xl font-bold">
                        {(property as any).surface || '--'} <span className="text-sm font-normal">m²</span>
                    </span>
                </div>
                <div className="w-px bg-border h-12 hidden sm:block"></div>
                <div className="flex flex-col items-center gap-1 min-w-20">
                    <Bed className="h-6 w-6 text-primary mb-1" />
                    <span className="text-xs font-medium text-muted-foreground uppercase">Chambres</span>
                    <span className="text-xl font-bold">{(property as any).bedrooms || '--'}</span>
                </div>
                <div className="w-px bg-border h-12 hidden sm:block"></div>
                <div className="flex flex-col items-center gap-1 min-w-20">
                    <Bath className="h-6 w-6 text-primary mb-1" />
                    <span className="text-xs font-medium text-muted-foreground uppercase">SDB</span>
                    <span className="text-xl font-bold">{(property as any).bathrooms || '--'}</span>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">À propos de ce bien</h2>
                <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                    {/* Utilise description_sale d'Odoo si dispo */}
                    {(property as any).description || (
                        <p className="italic text-gray-400">Aucune description détaillée n'a été saisie pour ce bien.</p>
                    )}
                </div>
            </div>

            <Separator />

            {/* Équipements (Placeholder visuel - à connecter avec des tags Odoo Many2many plus tard) */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold">Points forts</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Parking', 'Terrasse', 'Vue dégagée', 'Ascenseur'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- COLONNE DROITE : SIDEBAR (1/3) --- */}
        <div className="space-y-6">
            
            {/* Carte Financière */}
            <Card className="border-l-4 border-l-primary shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-primary" /> Détails Financiers
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Prix net</span>
                        <span className="font-semibold">{formatPrice(property.price, property.offerType)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Commission estimée</span>
                        <span className="font-semibold text-green-600">+ {formatPrice(property.commission, 'sale')}</span>
                    </div>
                    <Separator />
                    <div className="pt-2 bg-muted/30 -mx-6 px-6 py-3 mt-2 border-t flex justify-between items-center">
                        <span className="font-bold text-sm uppercase">Total</span>
                        <span className="font-bold text-xl text-primary">
                            {formatPrice(property.price + property.commission, property.offerType)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Carte Propriétaire */}
            {property.ownerId ? (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium text-muted-foreground">Mandant (Propriétaire)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                    {property.ownerName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-bold text-foreground">{property.ownerName}</p>
                                <Link 
                                    href={`/dashboard/contacts/${property.ownerId}`} 
                                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                                >
                                    <User className="h-3 w-3" /> Voir fiche client
                                </Link>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                             <Button variant="outline" size="sm" className="w-full">Appeler</Button>
                             <Button variant="outline" size="sm" className="w-full">Email</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                        <User className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">Aucun propriétaire associé</p>
                        <Link href={`/dashboard/properties/${propertyId}/edit`} className="text-xs text-primary underline mt-2">
                            Lier un contact
                        </Link>
                    </CardContent>
                </Card>
            )}

            <Card className="mt-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-blue-600" />
                        <CardTitle>Documents associés</CardTitle>
                    </div>
                    <UploadButton resModel="product.template" resId={propertyId} />
                </CardHeader>
                <CardContent>
                    <DocumentsList documents={documents} />
                </CardContent>
            </Card>

            <PropertyLeads 
                leads={leads} 
                propertyId={propertyId} 
                propertyName={property.name}
                allContacts={contactList}
            />
            {/* Quick Actions */}
            <Card>
                <CardContent className="p-4 space-y-3">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Créer une offre</Button>
                    <Button variant="secondary" className="w-full">Imprimer la fiche</Button>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}