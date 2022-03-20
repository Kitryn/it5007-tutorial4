import { createRandomReservation } from "@it5007-tutorial4/common";
import { useState } from "react";
import { Manifest, Reservation } from "../../models";
import { getRandomSeatNumber } from "../../util";
import "./BookingPage.css";
import Panels from "./Panels";
import SeatVisual from "./SeatVisual";

export default function BookingPage({
  activeManifest,
  addReservation,
  deleteReservations,
}: {
  activeManifest: Manifest;
  addReservation: (manifestId: string, reservation: Omit<Reservation, "date">) => Promise<void>;
  deleteReservations: (manifestId: string, seats: number[]) => Promise<void>;
}) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const addTravelerToActiveManifest = async (reservation?: Omit<Reservation, "date">): Promise<boolean> => {
    if (reservation == null) {
      let sn: number;
      try {
        sn = getRandomSeatNumber(activeManifest);
      } catch {
        return false;
      }
      reservation = createRandomReservation(sn);
    }

    // TODO: error handling
    try {
      await addReservation(activeManifest._id, reservation);
    } catch (err: any) {
      console.error(`Got error ${err} while adding reservation ${reservation}`);
      return false;
    }
    setSelectedSeat(null);
    return true;
  };

  const deleteTravelerOnActiveManifest = async (seatNumbers: number[]) => {
    await deleteReservations(activeManifest._id, seatNumbers);
    setSelectedSeat(null);
  };

  return (
    <div className="bookingContainer h-full">
      <SeatVisual manifest={activeManifest} selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} />
      <div className="bg-slate-200 flex w-full h-full justify-center">
        <Panels
          manifest={activeManifest}
          addTraveler={addTravelerToActiveManifest}
          deleteTraveler={deleteTravelerOnActiveManifest}
          selectedSeat={selectedSeat}
        />
      </div>
      {/* <BookingControlCenter
        manifest={allManifests[activeManifestIndex]}
        addTraveler={addTravelerToActiveManifest}
        deleteTraveler={deleteTravelerOnActiveManifest}
        selectedSeat={selectedSeat}
      /> */}
    </div>
  );
}
