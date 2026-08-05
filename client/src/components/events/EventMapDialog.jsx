import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EventMapDialog({ event }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mapQuery =
    event.latitude && event.longitude
      ? `${event.latitude},${event.longitude}`
      : event.location;

  if (!mapQuery) {
    return null;
  }

  const encodedQuery = encodeURIComponent(mapQuery);

  const embedUrl =
    `https://www.google.com/maps/embed/v1/place` +
    `?key=${apiKey}&q=${encodedQuery}`;

  const externalMapUrl =
    `https://www.google.com/maps/search/?api=1` + `&query=${encodedQuery}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-left text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {event.location}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-[#E4E4E1]">
          <iframe
            title={`Map for ${event.title}`}
            src={embedUrl}
            className="h-[400px] w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{event.location}</p>

          <Button variant="outline" asChild>
            <a href={externalMapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
