"use client";

import { useState, useEffect } from "react";

import { Calendar } from "@/components/ui/calendar"; // Composant Shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import { CalendarEvent, getEventsAction } from "./actions";
import { NewEventDialog } from "./components/new-event-dialog";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les événements
  const fetchEvents = async () => {
    setLoading(true);
    const res = await getEventsAction();
    if (res.success && res.data) {
      setEvents(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrer les événements pour le jour sélectionné
  const todaysEvents = events.filter((event) => {
    if (!date || !event.start) return false;
    // Note: event.start est UTC string, new Date(string) le convertit en local
    // Assurez-vous que l'affichage est cohérent
    return isSameDay(parseISO(event.start), date);
  });

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">Planning des visites et essais</p>
        </div>
        <NewEventDialog onEventCreated={fetchEvents} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        
        {/* Colonne Gauche : Calendrier */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={fr}
                className="rounded-md border shadow-sm w-full"
                // On met un petit point sous les jours qui ont des events (Bonus)
                modifiers={{
                  booked: (day) => events.some(e => isSameDay(parseISO(e.start), day)),
                }}
                modifiersStyles={{
                  booked: { fontWeight: 'bold', textDecoration: 'underline decoration-blue-500' }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Colonne Droite : Liste du jour */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="h-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl flex items-center gap-2">
                 <CalendarDays className="h-5 w-5 text-blue-600" />
                 {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              
              {loading ? (
                <div className="text-center py-10 text-gray-400">Chargement Odoo...</div>
              ) : todaysEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                   <Clock className="h-10 w-10 mb-2 opacity-20" />
                   <p>Aucun rendez-vous prévu ce jour.</p>
                </div>
              ) : (
                todaysEvents.map((event) => {
                  const startDate = parseISO(event.start);
                  const endDate = parseISO(event.stop);
                  
                  return (
                    <div key={event.id} className="flex gap-4 p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                       {/* Heure */}
                       <div className="flex flex-col items-center justify-center min-w-20 border-r pr-4">
                          <span className="text-lg font-bold text-slate-800">
                            {format(startDate, "HH:mm")}
                          </span>
                          <span className="text-xs text-slate-500">
                            à {format(endDate, "HH:mm")}
                          </span>
                       </div>

                       {/* Contenu */}
                       <div className="flex-1">
                          <h3 className="font-semibold text-lg text-slate-900">{event.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                             {event.location && (
                               <span className="flex items-center gap-1">
                                 <MapPin className="h-3 w-3" /> {event.location}
                               </span>
                             )}
                             <Badge variant="outline" className="bg-slate-50">
                               {event.duration ? `${event.duration}h` : 'RDV'}
                             </Badge>
                          </div>
                          {event.description && (
                            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                       </div>
                    </div>
                  );
                })
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}