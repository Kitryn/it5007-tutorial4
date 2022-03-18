import { Arg, Field, ID, InputType, Int, Mutation, ObjectType, registerEnumType, Resolver } from "type-graphql";
import { Manifest, ManifestModel } from "../models/Manifest";
import { Reservation, ReservationInput } from "../models/Reservation";

export enum BookingConfirmation {
  SUCCESS = "success",
  REJECTED = "rejected",
}

registerEnumType(BookingConfirmation, {
  name: "BookingConfirmation",
});

@ObjectType()
export class ReservationConfirmation {
  @Field((type) => ID, { nullable: true })
  manifestId?: string;

  @Field((type) => BookingConfirmation)
  status!: BookingConfirmation;

  @Field((type) => Manifest, { nullable: true })
  manifest?: Manifest;
}

@ObjectType()
export class SeatDeletedConfirmation {
  @Field((type) => Int)
  sn!: number;

  @Field((type) => BookingConfirmation)
  status!: BookingConfirmation;
}

@ObjectType()
export class DeletedConfirmation {
  @Field((type) => ID, { nullable: true })
  manifestId?: string;

  @Field((type) => BookingConfirmation)
  status!: BookingConfirmation;

  @Field((type) => [SeatDeletedConfirmation], { nullable: true })
  seats?: SeatDeletedConfirmation[];
}

@InputType()
export class DeleteSeatsInput {
  @Field((type) => ID)
  manifestId!: string;

  @Field((type) => [Int])
  seats!: number[];
}

@Resolver()
export class ReservationResolver {
  @Mutation(() => ReservationConfirmation)
  async addReservation(
    @Arg("manifestId", (type) => ID) manifestId: string,
    @Arg("reservation", (type) => ReservationInput) reservationInput: ReservationInput,
  ): Promise<ReservationConfirmation> {
    const reservation: Reservation = {
      date: new Date(),
      ...reservationInput,
    };

    if (reservation.sn >= 25 || reservation.sn < 0) {
      // 0-indexed
      console.log(`Attempt to insert with seat number >= 25 or < 0 rejected`);
      return {
        status: BookingConfirmation.REJECTED,
      };
    }
    try {
      const res = await ManifestModel.addReservation(manifestId, reservation);
      return {
        manifestId: res._id!,
        status: BookingConfirmation.SUCCESS,
        manifest: res,
      };
    } catch (err: any) {
      console.error(`Server error while updating reservation: ${err}`);
      return {
        status: BookingConfirmation.REJECTED,
      };
    }
  }

  @Mutation(() => DeletedConfirmation)
  async deleteReservation(
    @Arg("manifestId", (type) => ID) manifestId: string,
    @Arg("seats", (type) => [Int]) seats: number[],
  ): Promise<DeletedConfirmation> {
    /**
     * WARNING: NOT ATOMIC
     * Mongodb transactions require replicaset, not usable with standalone instance
     */
    try {
      const res = await ManifestModel.deleteReservations(manifestId, seats);
      const confirmations: SeatDeletedConfirmation[] = Array.from(res.entries()).map(([k, v]) => ({
        sn: k,
        status: v ? BookingConfirmation.SUCCESS : BookingConfirmation.REJECTED,
      }));
      return {
        manifestId,
        status: BookingConfirmation.SUCCESS,
        seats: confirmations,
      };
    } catch (err: any) {
      console.error(`Server error while deleting reservations`);
      return {
        status: BookingConfirmation.REJECTED,
      };
    }
  }
}
