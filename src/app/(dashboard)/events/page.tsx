import Add from "@/components/Add";
import { getEvents, getRegisteredEvents } from "@/actions/events";
import { InsertEventSchema } from "@/db/schema";
import AddItemCard from "@/components/card/AddItemCard";
import EventCard from "@/components/card/EventCard";
import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { v4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



const Events = async () => {

    const [error, events] = await getEvents();
    const user = await currentUser()

    if (!user) return (
        <div>Please sign in</div>
    )

    if (error || events === null) return (
        <div>An error occured or no events found</div>
    )

    if (events.length === 0 && hasPermission(user, "add:events")) return (
        <div className="flex items-center justify-center grow">
            <Add path="/events/create" />
        </div>
    )

    return (
        <div className="p-4 shadow-custom rounded-lg grow ">
            <Tabs defaultValue="all" className="">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="registered">Registered</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

                        {
                            events.map((event) => {

                                return <EventCard
                                    key={v4()}
                                    event={event}
                                />
                            })

                        }
                        {hasPermission(user, "add:events") && <AddItemCard href="/events/create" />}
                    </div>
                </TabsContent>
                <TabsContent value="registered">
                    <RegisteredEvents/>
                </TabsContent>
            </Tabs>

        </div>
    );
}


async function RegisteredEvents() {
    
    const {error: EventError, result: EventResult} = await getRegisteredEvents();
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {
            EventResult.map((event) => {

                return <EventCard
                    key={v4()}
                    event={event}
                />
            })

        }
        </div>
    )
} 

export default Events