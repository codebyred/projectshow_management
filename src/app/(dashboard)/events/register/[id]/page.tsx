import { getEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { isPastLastDateOfEventRegistration } from "@/lib/utils";
import Link from "next/link";
import { AiOutlineExclamationCircle } from "react-icons/ai";


const StudentEventView = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const eventId = (await params).id

    const [error, result] = await getEvent(eventId);

    if (error !== null || result === null) return (
        <div>No data found related to event</div>
    )

    return (
        <div className="shadow-custom p-2 rounded-lg">
            <h1 className="text-4xl">
                {result.at(0)?.eventName}
            </h1>
            <h2 className="text-2xl font-thin">
                Requirements
            </h2>
            <p>
                {result.at(0)?.requirements}
            </p>
            {
                isPastLastDateOfEventRegistration(result.at(0)?.lastDateOfRegistration!)
                    ?
                    <div>
                        <p className="text-red-500 flex items-center gap-2"><AiOutlineExclamationCircle/>Event registration is closed</p>
                        <Button>
                            Submit Project
                        </Button>
                    </div>

                    :
                    <Button>
                        <Link
                            href={
                                `/teams/create?eventName=${encodeURIComponent(result.at(0)?.eventName as string)}&eventId=${result.at(0)?.id}`
                            }
                        >
                            Register
                        </Link>
                    </Button>
            }
        </div>
    )
}

export default StudentEventView;