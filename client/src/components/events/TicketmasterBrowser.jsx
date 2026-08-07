import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TicketmasterResultCard from "./TicketmasterResultCard";
import { toast } from "sonner";
import { searchTicketmasterEvents } from "@/api/ticketmasterApi";
export default function TicketmasterBrowser({
  groupId,
  groupEvents = [],
  onEventAdded,
}) {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [eventDateFrom, setEventDateFrom] = useState("");
  const [eventDateTo, setEventDateTo] = useState("");
  const [results, setResults] = useState([]);
  const [pageData, setPageData] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const addedTicketmasterIds = useMemo(() => {
    return new Set(
      groupEvents
        .map((event) => event.ticketmasterid ?? event.ticketmasterId)
        .filter(Boolean),
    );
  }, [groupEvents]);

  async function searchEvents(page = 0) {
    const trimmedKeyword = keyword.trim();
    const trimmedCity = city.trim();

    if (!trimmedKeyword && !trimmedCity) {
      toast.error("Enter a keyword or city");
      return;
    }

    if (eventDateFrom && eventDateTo && eventDateTo < eventDateFrom) {
      toast.error(
        "The final search date must be on or after the first search date",
      );
      return;
    }
    try {
      setLoading(true);

      const data = await searchTicketmasterEvents({
        keyword: trimmedKeyword,
        city: trimmedCity,
        eventDateFrom,
        eventDateTo,
        page,
      });

      setResults(data.events ?? []);
      setPageData({
        number: data.page?.number ?? 0,
        totalPages: data.page?.totalPages ?? 0,
        totalElements: data.page?.totalElements ?? 0,
      });
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      toast.error("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchEvents(0);
  }

  function handlePreviousPage() {
    if (pageData.number > 0) {
      searchEvents(pageData.number - 1);
    }
  }

  function handleNextPage() {
    if (pageData.number + 1 < pageData.totalPages) {
      searchEvents(pageData.number + 1);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h3 className="font-medium">Search Ticketmaster</h3>

        <p className="text-muted-foreground text-sm">
          Search for concerts, sports, theater, and other events.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="ticketmaster-keyword"
            className="mb-1.5 block text-xs font-semibold"
          >
            Keyword
          </label>

          <Input
            id="ticketmaster-keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Concert, musical, sports..."
          />
        </div>

        <div>
          <label
            htmlFor="ticketmaster-city"
            className="mb-1.5 block text-xs font-semibold"
          >
            City
          </label>

          <Input
            id="ticketmaster-city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Atlanta"
          />
        </div>

        <div>
          <label
            htmlFor="event-date-from"
            className="mb-1.5 block text-xs font-semibold"
          >
            Events from
          </label>

          <Input
            id="event-date-from"
            type="date"
            value={eventDateFrom}
            onChange={(event) => setEventDateFrom(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="event-date-to"
            className="mb-1.5 block text-xs font-semibold"
          >
            Events through
          </label>

          <Input
            id="event-date-to"
            type="date"
            value={eventDateTo}
            min={eventDateFrom || undefined}
            onChange={(event) => setEventDateTo(event.target.value)}
          />
        </div>

        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {
              setKeyword("");
              setCity("");
              setEventDateFrom("");
              setEventDateTo("");
              setResults([]);
              setHasSearched(false);
              setPageData({
                number: 0,
                totalPages: 0,
                totalElements: 0,
              });
            }}
          >
            Clear
          </Button>
        </div>
      </form>

      {hasSearched && (
        <p className="text-muted-foreground text-sm">
          {pageData.totalElements === 0
            ? "No events found."
            : `${pageData.totalElements} events found`}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((event) => (
          <TicketmasterResultCard
            key={event.ticketmasterId}
            event={event}
            groupId={groupId}
            initiallyAdded={addedTicketmasterIds.has(event.ticketmasterId)}
            onEventAdded={onEventAdded}
          />
        ))}
      </div>

      {pageData.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousPage}
            disabled={loading || pageData.number === 0}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {pageData.number + 1} of {pageData.totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            onClick={handleNextPage}
            disabled={loading || pageData.number + 1 >= pageData.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
