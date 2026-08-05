import CreateGroupModal from "@/components/groups/CreateGroupModal";
import GroupCard from "@/components/groups/GroupCard";
import JoinGroupModal from "@/components/groups/JoinGroupModal";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:3001/groups", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setGroups(data.groups ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Your weekends
            </p>

            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Groups
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Make plans, vote on ideas, and keep everyone in sync.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <JoinGroupModal onGroupChange={fetchGroups} />
            <CreateGroupModal onGroupChange={fetchGroups} />
          </div>
        </header>

        <div className="relative mb-6 max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a group"
            className="h-10 w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
          />
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Loading groups...
          </p>
        ) : filteredGroups.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-dashed bg-card/40 px-6 py-12 text-center">
            <h2 className="font-heading text-xl font-semibold">
              {query ? "No matching groups" : "No groups yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {query
                ? "Try searching with a different group name."
                : "Create a group or join one with an invitation code."}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default Groups;
