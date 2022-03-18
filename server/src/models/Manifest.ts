import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { createRandomReservation, Reservation } from "./Reservation";

@ObjectType()
export class Manifest {
  @Field((type) => ID)
  _id?: string;

  @Field()
  @prop({ required: true, index: true })
  date!: Date;

  @Field((type) => [Reservation])
  @prop({ required: true, default: [], type: () => [Reservation] })
  seats!: Reservation[];

  public static async addReservation(
    this: ReturnModelType<typeof Manifest>,
    manifestId: string,
    reservation: Reservation,
  ): Promise<Manifest> {
    /**
     * NOTE: this is NOT atomic
     * Mongo doesn't support transactions in a standalone environment, requires a replica set, so no transactions here
     */
    try {
      const res = await this.findById(new ObjectId(manifestId));
      if (res == null) {
        throw new Error(`Error while updating manifest ${manifestId} with reservation ${reservation}`);
      }
      for (const s of res.seats) {
        if (s.sn === reservation.sn) {
          throw new Error(`Duplicate seat number found`);
        }
      }

      const up_res = await this.findOneAndUpdate(
        { _id: new ObjectId(manifestId) },
        { $push: { seats: reservation } },
        { returnDocument: "after" },
      );
      if (up_res == null) {
        throw new Error(`Something went wrong while updating db!`);
      }
      return up_res;
    } catch (err: any) {
      throw new Error(`Something went wrong: ${err}`);
    }
  }

  public static async deleteReservations(
    this: ReturnModelType<typeof Manifest>,
    manifestId: string,
    seats: number[],
  ): Promise<Map<number, boolean>> {
    try {
      const res = await this.findOneAndUpdate(
        { _id: new ObjectId(manifestId) },
        { $pull: { seats: { sn: { $in: seats } } } },
        { returnDocument: "after" },
      );
      if (res == null) {
        throw new Error(`Error while updating manifest ${manifestId} - was manifest not found?`);
      }

      const occupiedSeats = new Set<number>(res.seats.map((s) => s.sn));

      const output = seats.reduce((acc, sn) => {
        if (occupiedSeats.has(sn)) {
          acc.set(sn, false);
        } else {
          acc.set(sn, true);
        }
        return acc;
      }, new Map<number, boolean>());

      return output;
    } catch (err: any) {
      throw new Error(`Something went wrong: ${err}`);
    }
  }
}

export const ManifestModel = getModelForClass(Manifest);

export function getRandomSeatNumber(manifest: Manifest): number {
  const occupiedSeats = new Set(manifest.seats.map((s) => s.sn));
  const unoccupiedSeats = Array(25)
    .fill(null)
    .map((_, i) => (occupiedSeats.has(i) ? null : i))
    .filter((sn): sn is number => sn != null);

  return unoccupiedSeats[Math.floor(Math.random() * unoccupiedSeats.length)];
}

export function createRandomManifests(num: number): Manifest[] {
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const randomTime = (offset: number) => {
    return offset + Math.floor(Math.random() * (8 * 4)) * 15 * 60 * 1000; // every 15 minutes
  };

  const baseDate = new Date(2022, 3, 0); // UTC
  const baseTimeMs = (8 + 8) * 60 * 60 * 1000; // 8am UTC+8
  return Array(num)
    .fill(null)
    .map((_, i): Manifest => {
      const dt = new Date(addDays(baseDate, i).getTime() + randomTime(baseTimeMs));
      return {
        date: dt,
        seats: [],
      };
    })
    .map((m) => {
      Array(Math.floor(Math.random() * 10))
        .fill(null)
        .forEach((_) => {
          const sn = getRandomSeatNumber(m);
          const dt = new Date(addDays(m.date, -Math.floor(Math.random() * 30)).getTime() + randomTime(baseTimeMs));
          m.seats.push(createRandomReservation(sn, dt));
        });
      return m;
    });
}
