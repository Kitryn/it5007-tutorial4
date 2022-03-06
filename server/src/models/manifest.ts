import { Reservation } from "./reservation";

export interface Manifest {
  id: Number;
  date: Date;
  seats: Reservation[];
}
