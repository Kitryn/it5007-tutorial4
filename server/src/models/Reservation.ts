import { prop } from "@typegoose/typegoose";
import { Field, ObjectType, Int, InputType } from "type-graphql";
import { randomName, randomTel } from "@it5007-tutorial4/common";

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
