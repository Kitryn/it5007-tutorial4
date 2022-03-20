import React, { useEffect, useRef, useState } from "react";

interface AddReservationForm {
  name: { value: string };
}

export default function AddTravelerPane({ addToBlacklist }: { addToBlacklist: (name: string) => Promise<void> }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (errorMessage != null) {
      setTimeout(() => setErrorMessage(null), 2500);
    }
  }, [errorMessage]);

  const handleAdd = async (name?: string) => {
    if (name == null) {
      setErrorMessage("Name cannot be empty!");
      return;
    }
    try {
      await addToBlacklist(name);
    } catch (err: any) {
      setErrorMessage("Something went wrong adding to blacklist");
      return;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      name: { value: travelerName },
    } = event.target as typeof event.target & AddReservationForm;

    handleAdd(travelerName);
    formRef.current?.reset();
  };

  return (
    <div className="flex justify-center">
      <div className="bg-blue-50 shadow min-w-fit w-4/6 justify-center content-center p-5 rounded-lg mt-4">
        <div className="text-center font-bold text-lg pb-5">Add To Blacklist</div>
        <form
          ref={formRef}
          id="submitBlacklistForm"
          action=""
          onSubmit={(event) => handleSubmit(event)}
          className="mb-0"
        >
          <label htmlFor="name" className="inputLabel">
            Name:
          </label>
          <input type="text" id="name" name="name" autoComplete="name" className="inputField" required />
          <div>
            <button type="submit" className="button">
              Submit
            </button>
          </div>
        </form>
        {errorMessage != null ? (
          <div
            className="bg-red-100 w-full py-4 px-4 mb-5 shadow-sm rounded-md 
          border border-transparent font-medium text-gray-700"
          >
            {errorMessage}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
