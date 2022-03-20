import { Arg, Field, ID, InputType, Int, Mutation, ObjectType, registerEnumType, Resolver, Query } from "type-graphql";
import { BlacklistEntry, BlacklistEntryModel } from "../models/Blacklist";
import { Manifest, ManifestModel } from "../models/Manifest";
import { Reservation, ReservationInput } from "../models/Reservation";

@Resolver()
export class BlacklistResolver {
  @Query(() => [BlacklistEntry])
  async getBlacklist(): Promise<BlacklistEntry[]> {
    const blacklists = await BlacklistEntryModel.find({});
    return blacklists;
  }

  @Mutation(() => Boolean)
  async addNameToBlacklist(@Arg("name", (type) => String) name: string): Promise<boolean> {
    try {
      const res = await BlacklistEntryModel.create({ name });
      if (res == null) {
        return false;
      }
      return true;
    } catch (err: any) {
      console.log(`Got error inserting into blacklist: ${err}`);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteNameFromBlacklist(@Arg("name", (type) => String) name: string): Promise<boolean> {
    const res = await BlacklistEntryModel.deleteOne({ name });
    console.log(`Deleted ${name}: ${res}`);
    if (res == null || res.deletedCount === 0) {
      return false;
    }
    return true;
  }

  @Mutation(() => Number)
  async deleteAllFromBlacklist(): Promise<number> {
    const res = await BlacklistEntryModel.deleteMany({});
    if (res == null) {
      return 0;
    }
    return res.deletedCount;
  }
}
