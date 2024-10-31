"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {useFormStatus} from "react-dom";

export function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <>
      {loading ? (
        <Button disabled className="w-fit ">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button className="w-fit " type="submit">
          Create Now
          <Sparkles className="ml-2 w-4 h-4" />
        </Button>
      )}
    </>
  );
}


export function SaveButton (){
  const {pending}= useFormStatus();
  return(
    <>
    {pending?(
      <Button disabled className="w-fit ">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button className="w-fit" type="submit">
          Save Now
          
        </Button>
      )}
    </>
  );
}

export function GetStartedButton() {
  return (
    <Link href="/dashboard/billing">
      <Button className="w-full">
        <Sparkles className="mr-2 w-4 h-4" />
        Get Started
      </Button>
    </Link>
  );
}
export function CreateNewAcademicPaper() {
  return (
    <Link href="/dashboard/new">
      <Button className="w-full ">
        <Sparkles className="mr-2 w-4 h-4" />
        Create New Academic Paper
      </Button>
    </Link>
  );
}


export function TrashDelete() {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    // Aquí puedes manejar el delete manualmente si es necesario
  };

  return (
    <>
      {loading ? (
        <Button variant={"destructive"} size="icon" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant={"destructive"} size="icon" type="button" onClick={handleDelete}>
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}

export function StripeSubscriptionCreationButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button type="submit" className="w-full ">
          Create Subscription
        </Button>
      )}
    </>
  );
}

export function StripePortal() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button className="w-fit" type="submit">
          View payment details
        </Button>
      )}
    </>
  );
}

