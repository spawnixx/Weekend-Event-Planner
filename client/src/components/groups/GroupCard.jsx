import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, KeyRound, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  const memberCount = group?.members?.length;

  return (
    <Link
      to={`/groups/${group.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <Card className="h-full cursor-pointer gap-0 rounded-xl border-border bg-card py-0 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
        <CardHeader className="flex-row items-start justify-between gap-4 p-5">
          <div className="min-w-0">
            <CardTitle className="truncate font-heading text-xl font-semibold">
              {group.name}
            </CardTitle>
          </div>

          <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            {memberCount !== undefined ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-4" />

                <span className="text-xs">
                  {memberCount} {memberCount === 1 ? "member" : "members"}
                </span>
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5">
              <KeyRound className="size-3.5 text-muted-foreground" />

              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {group.invite_code}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
