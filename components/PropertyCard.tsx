// components/ui/PropertyCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Move, MapPin } from "lucide-react";

// Types (à déplacer dans un fichier types.ts plus tard)
interface PropertyProps {
  data: {
    id: number;
    title: string;
    type: string;
    status: string;
    price: number;
    currency: string;
    location: string;
    beds: number;
    baths: number;
    area: number;
    image: string;
  };
}

export function PropertyCard({ data }: PropertyProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black backdrop-blur-sm">
          {data.status}
        </div>
        <div className="absolute bottom-4 left-4 rounded-md bg-black/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          {data.price.toLocaleString()} {data.currency}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 text-sm text-blue-600 font-medium">{data.type}</div>
        <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">
          {data.title}
        </h3>
        <div className="mb-4 flex items-center text-gray-500 text-sm">
          <MapPin className="mr-1 h-4 w-4" />
          {data.location}
        </div>

        {/* Features Icons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{data.beds} <span className="hidden sm:inline">Chb.</span></span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{data.baths} <span className="hidden sm:inline">Sdb.</span></span>
          </div>
          <div className="flex items-center gap-1">
            <Move className="h-4 w-4" />
            <span>{data.area} m²</span>
          </div>
        </div>
      </div>

      {/* Full link overlay */}
      <Link href={`/properties/${data.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">Voir les détails</span>
      </Link>
    </div>
  );
}