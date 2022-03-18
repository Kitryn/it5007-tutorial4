import { prop } from "@typegoose/typegoose";
import { Field, ObjectType, Int, InputType } from "type-graphql";
import { randomName, randomTel } from "../util";

@ObjectType()
export class Reservation {
  @Field((type) => Int)
  @prop({ required: true })
  sn!: number;

  @Field()
  @prop({ required: true })
  name!: string;

  @Field()
  @prop({ required: true })
  phone!: string;

  @Field()
  @prop({ required: true })
  date!: Date;
}

@InputType()
export class ReservationInput implements Partial<Reservation> {
  @Field((type) => Int)
  sn!: number;

  @Field()
  name!: string;

  @Field()
  phone!: string;
}

export function createRandomReservation(sn: number, dt?: Date): Reservation {
  dt = dt ? dt : new Date();

  return {
    sn,
    name: randomName(),
    phone: randomTel(),
    date: dt,
  };
}
