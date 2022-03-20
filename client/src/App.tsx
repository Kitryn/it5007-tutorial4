import "./App.css";
import "./components/NavBar.css";

import NavBar from "./components/NavBar";
import NavBarItem from "./components/NavBarItem";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_RESERVATION,
  DeletedConfirmation,
  DELETE_RESERVATION,
  Manifest,
  MANIFESTS,
  Reservation,
  ReservationConfirmation,
  RESET_ALL,
  RESET_TO_RANDOM,
} from "./models";
import { useMemo, useState } from "react";
import SideBar from "./components/SideBar";
import BookingPage from "./components/BookingPage/BookingPage";
import HomePage from "./components/HomePage";
import { createRandomReservation } from "@it5007-tutorial4/common";
import { getRandomSeatNumber } from "./util";

function App() {
  /**
   * Set up GQL queries
   */
  // Load all manifests
  const {
    loading: loadingManifests,
    error: errorManifests,
    data: dataManifests,
    refetch,
  } = useQuery<{ manifests: Manifest[] }>(MANIFESTS);

  const manifests = (dataManifests?.manifests ?? null)?.map((m) => {
    return {
      ...m,
      date: new Date(m.date), // should probably use field links to parse scalars...
      seats: [...m.seats.map((s) => ({ ...s, date: new Date(s.date) }))], // sigh hack...
    };
  });

  // Reset all manifests
  const [resetAllMutation, { loading: loadingResetAllMutation, error: errorResetAllMutation, data: dataResetAll }] =
    useMutation<{ resetAllManifests: boolean }>(RESET_ALL);

  // Reset to random seats
  const [
    resetRandomMutation,
    { loading: loadingResetRandomMutation, error: errorResetRandomMutation, data: dataResetRandom },
  ] = useMutation<{ resetToRandomManifests: boolean }>(RESET_TO_RANDOM);

  // Add reservation
  const [
    addReservationMutation,
    { loading: loadingAddReservationMutation, error: errorAddReservationMutation, data: dataAddReservationMutation },
  ] = useMutation<{ addReservation: ReservationConfirmation }>(ADD_RESERVATION);

  // Delete reservation(s)
  const [
    delReservationsMutation,
    { loading: loadingDelReservationMutation, error: errorDelReservationMutation, data: dataDelReservationMutation },
  ] = useMutation<{ deleteReservation: DeletedConfirmation }>(DELETE_RESERVATION);

  /**
   * Callbacks to handle state
   */
  const [activeManifestId, setActiveManifestId] = useState<string | null>(null);
  const activeManifest =
    manifests != null && activeManifestId != null
      ? (manifests.filter((m) => m._id === activeManifestId) ?? [null])[0]
      : null; // if this is slow, wrap in useMemo

  const deleteAll = async () => {
    await resetAllMutation();
    await refetch();
  };

  const resetToRandom = async () => {
    await resetRandomMutation();
    await refetch();
  };

  const goHome = () => {
    setActiveManifestCallback(null);
  };

  const setActiveManifestCallback = (id: string | null) => {
    console.log(`Set active manifest: ${id ?? "homepage"}`);
    setActiveManifestId(id);
  };

  const addReservation = async (manifestId: string, reservation: Omit<Reservation, "date">) => {
    console.log(`Adding reservation ${reservation} to manifest ${manifestId}`);
    await addReservationMutation({ variables: { reservation: reservation, manifestId } });
    await refetch();
  };

  const deleteReservations = async (manifestId: string, seats: number[]) => {
    console.log(`Deleting reservations ${seats} on manifest ${manifestId}`);
    await delReservationsMutation({ variables: { manifestId, seats } });
    await refetch();
  };

  /**
   * Render app
   */
  return (
    <div className="App flex flex-col h-screen">
      <NavBar>
        <NavBarItem onclick={() => goHome()}>Booking System</NavBarItem>
        <NavBarItem hasDropdown={true}>
          <button>Options</button>
          <div className="dropdown flex flex-col">
            <button
              onClick={async () => {
                if (activeManifestId == null) return;
                // Hacky! memo this in the future
                const m = manifests?.filter((m) => m._id === activeManifestId);

                if (m == null || m.length === 0) {
                  console.error(`No manifest found, or no active manifest`);
                  return;
                }

                const sn = getRandomSeatNumber(m[0]);
                const randomReservation = createRandomReservation(sn);
                const r = await addReservation(activeManifestId, randomReservation);
                console.log(r);
                console.log(dataAddReservationMutation);
              }}
            >
              Add to current
            </button>
            <button onClick={() => deleteAll()}>Clear all</button>
            <button onClick={() => resetToRandom()}>Reset to Random</button>
          </div>
        </NavBarItem>
      </NavBar>
      <div className="flex flex-grow">
        <SideBar
          trains={manifests ?? []}
          activeManifestId={activeManifestId}
          setActiveManifest={(id) => setActiveManifestCallback(id)}
        />
        {activeManifest == null ? (
          <HomePage allManifests={manifests ?? []} setActiveManifest={setActiveManifestId} />
        ) : (
          <BookingPage
            activeManifest={activeManifest}
            addReservation={addReservation}
            deleteReservations={deleteReservations}
          />
        )}
      </div>
    </div>
  );
}

export default App;
