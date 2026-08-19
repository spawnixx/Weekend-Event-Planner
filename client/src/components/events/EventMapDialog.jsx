import { MapPin, SquareArrowOutUpRight } from "lucide-react";
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-left text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {event.location}
          <SquareArrowOutUpRight className="h-3 w-3 shrink-0" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-[#E4E4E1]">
          <iframe
            title={`Map for ${event.title}`}
            src={embedUrl}
            className="h-100 w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
