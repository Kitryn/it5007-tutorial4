import { ApolloError } from "@apollo/client";
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
  apolloError,
  blacklist,
  addToBlacklist,
  deleteNameFromBlacklist,
}: {
  activeManifest: Manifest;
  addReservation: (manifestId: string, reservation: Omit<Reservation, "date">) => Promise<void>;
  deleteReservations: (manifestId: string, seats: number[]) => Promise<void>;
  apolloError?: ApolloError | Error;
  blacklist: Set<string>;
  addToBlacklist: (name: string) => Promise<void>;
  deleteNameFromBlacklist: (name: string) => Promise<void>;
}) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const addTravelerToActiveManifest = (reservation?: Omit<Reservation, "date">): boolean => {
    if (reservation == null) {
      let sn: number;
      try {
        sn = getRandomSeatNumber(activeManifest);
      } catch {
        return false;
      }
      reservation = createRandomReservation(sn);
    }

    // we let apollo-client do our error handling
    addReservation(activeManifest._id, reservation);
    setSelectedSeat(null);
    return true;
  };

  const deleteTravelerOnActiveManifest = (seatNumbers: number[]): boolean => {
    deleteReservations(activeManifest._id, seatNumbers);
    setSelectedSeat(null);
    return true;
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
          apolloError={apolloError}
          blacklist={blacklist}
          addToBlacklist={addToBlacklist}
          deleteNameFromBlacklist={deleteNameFromBlacklist}
        />
      </div>
    </div>
  );
}
