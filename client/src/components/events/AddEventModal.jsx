import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateEventForm from "./CreateEventForm";
import TicketmasterBrowser from "./TicketmasterBrowser";

export default function AddEventModal({ groupId, groupEvents, onEventAdded }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleEventAdded(event) {
    onEventAdded?.(event);
  }
  function handleCustomEventCreated(event) {
    handleEventAdded(event);
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Event</Button>
      </DialogTrigger>
      <DialogContent className=" flex max-h-[90vh] flex-col sm:max-w-4xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add an event</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="custom" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="grid w-full shrink-0 grid-cols-2">
            <TabsTrigger
              value="custom"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Custom Event
            </TabsTrigger>

            <TabsTrigger
              value="ticketmaster"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Ticketmaster
            </TabsTrigger>
          </TabsList>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <TabsContent value="custom" className="mt-6">
              <CreateEventForm
                groupId={groupId}
                onEventCreated={handleCustomEventCreated}
                onCancel={() => setDialogOpen(false)}
              />
            </TabsContent>

            <TabsContent value="ticketmaster" className="mt-6">
              <TicketmasterBrowser
                groupId={groupId}
                groupEvents={groupEvents}
                onEventAdded={handleEventAdded}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
