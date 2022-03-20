import React, { useEffect, useRef, useState } from "react";
import { Reservation } from "../../models";

interface AddReservationForm {
  name: { value: string };
  tel: { value: string };
}

export default function AddTravelerPane({
  selectedSeat,
  addTraveler,
}: {
  selectedSeat: number | null;
  addTraveler: (r?: Omit<Reservation, "date">) => Promise<boolean>;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (errorMessage != null) {
      setTimeout(() => setErrorMessage(null), 2500);
    }
  }, [errorMessage]);

  const handleAdd = async (reservation?: Reservation) => {
    const success = await addTraveler(reservation);
    if (!success) {
      setErrorMessage("Unable to add reservation, are seats full?");
      return;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedSeat == null) {
      setErrorMessage("No seat selected! Click a seat on the left!");
      return;
    }

    const {
      name: { value: travelerName },
      tel: { value: travelerTel },
    } = event.target as typeof event.target & AddReservationForm;

    handleAdd({
      sn: selectedSeat,
      name: travelerName,
      phone: travelerTel,
    });
    formRef.current?.reset();
  };

  return (
    <div className="flex justify-center">
      <div className="bg-blue-50 shadow min-w-fit w-4/6 justify-center content-center p-5 rounded-lg mt-4">
        <div className="text-center font-bold text-lg pb-5">Register New Reservation</div>
        <div className="inputLabel mb-4">Selected seat: {selectedSeat != null ? selectedSeat + 1 : ""}</div>
        <form
          ref={formRef}
          id="submitTravelerForm"
          action=""
          onSubmit={(event) => handleSubmit(event)}
          className="mb-0"
        >
          <label htmlFor="name" className="inputLabel">
            Name:
          </label>
          <input type="text" id="name" name="name" autoComplete="name" className="inputField" required />
          <label htmlFor="tel" className="inputLabel">
            Phone:
          </label>
          <input type="tel" id="tel" name="tel" autoComplete="tel" className="inputField" required />
          <div>
            <button type="submit" className="button">
              Submit
            </button>
          </div>
        </form>
        <button className="button" onClick={() => handleAdd()}>
          Create Random Reservation
        </button>
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
