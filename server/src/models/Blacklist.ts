import { Field, ID, ObjectType } from "type-graphql";
import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";

@ObjectType()
export class BlacklistEntry {
  @Field((type) => ID)
  _id?: string;

  @Field()
  @prop({ required: true, index: true, unique: true })
  name!: string;

  public static async isInBlacklist(this: ReturnModelType<typeof BlacklistEntry>, name: string): Promise<boolean> {
    const res = await this.findOne({ name });
    console.log(`find blacklist: ${res}`);
    if (res == null) {
      return false;
    }
    return true;
  }
}

export const BlacklistEntryModel = getModelForClass(BlacklistEntry);
