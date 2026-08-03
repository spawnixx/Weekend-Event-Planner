import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TicketmasterResultCard from "./TicketmasterResultCard";
import { toast } from "sonner";

export default function TicketmasterBrowser({
  groupId,
  groupEvents = [],
  onEventAdded,
}) {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
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

    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
      });

      if (trimmedKeyword) {
        params.set("keyword", trimmedKeyword);
      }

      if (trimmedCity) {
        params.set("city", trimmedCity);
      }

      const res = await fetch(
        `http://localhost:3001/ticketmaster/events?${params}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.error?.message ||
            data.message ||
            "Unable to search Ticketmaster",
        );
        return;
      }

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

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <label
            htmlFor="ticketmaster-keyword"
            className="mb-1 block text-sm font-medium"
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
            className="mb-1 block text-sm font-medium"
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

        <Button type="submit" disabled={loading} className="self-end">
          {loading ? "Searching..." : "Search"}
        </Button>
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
