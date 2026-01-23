'use client'

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

export function ShareButton({ propertyName, price }: { propertyName: string, price: string }) {
  const handleShare = () => {
    const text = `Consultez ce bien chez AGTS : ${propertyName} - Prix: ${price}. Plus d'infos ici : ${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    toast.success("Lien prêt à être partagé")
  }

  return (
    <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
      <Share2 className="h-4 w-4" /> Partager sur WhatsApp
    </Button>
  )
}