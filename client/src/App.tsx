import "./App.css";
import "./components/NavBar.css";

import NavBar from "./components/NavBar";
import NavBarItem from "./components/NavBarItem";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
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
import { useState } from "react";
import SideBar from "./components/SideBar";
import BookingPage from "./components/BookingPage/BookingPage";
import HomePage from "./components/HomePage";

function App() {
  /**
   * Set up GQL queries
   */
  // GQL error handler
  // spaghetti -- either use context or other state management lib
  const [gqlError, setGqlError] = useState<ApolloError | Error | undefined>(undefined);
  const onGqlError = (err: ApolloError) => {
    setGqlError(err);
    setTimeout(() => setGqlError(undefined), 5000);
  };

  // Load all manifests
  const { data: dataManifests, refetch } = useQuery<{ manifests: Manifest[] }>(MANIFESTS);

  const manifests = (dataManifests?.manifests ?? null)?.map((m) => {
    return {
      ...m,
      date: new Date(m.date), // should probably use field links to parse scalars...
      seats: [...m.seats.map((s) => ({ ...s, date: new Date(s.date) }))], // sigh hack...
    };
  });

  // Reset all manifests
  const [resetAllMutation] = useMutation<{ resetAllManifests: boolean }>(RESET_ALL);

  // Reset to random seats
  const [resetRandomMutation] = useMutation<{ resetToRandomManifests: boolean }>(RESET_TO_RANDOM);

  // Add reservation
  const [addReservationMutation, { data: dataAddReservationMutation }] = useMutation<{
    addReservation: ReservationConfirmation;
  }>(ADD_RESERVATION, { onError: (err) => onGqlError(err) });

  // Delete reservation(s)
  const [delReservationsMutation, { data: dataDelReservationMutation }] = useMutation<{
    deleteReservation: DeletedConfirmation;
  }>(DELETE_RESERVATION, { onError: (err) => onGqlError(err) });

  // Check data on updates
  if (
    dataAddReservationMutation?.addReservation.status === "rejected" ||
    dataDelReservationMutation?.deleteReservation.status === "rejected"
  ) {
    setGqlError(new Error(`Invalid parameters submitted to the server`));
  }

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
            apolloError={gqlError}
          />
        )}
      </div>
    </div>
  );
}

export default App;
