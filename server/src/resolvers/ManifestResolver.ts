import { ObjectId } from "mongodb";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { createRandomManifests, Manifest, ManifestModel } from "../models/Manifest";
import { Reservation } from "../models/Reservation";

@Resolver()
export class ManifestResolver {
  @Query(() => [Manifest])
  async manifests(@Arg("dateAfter", (type) => Date, { nullable: true }) dateAfter: Date | null): Promise<Manifest[]> {
    const query = dateAfter != null ? { date: { $gte: dateAfter } } : {};
    const manifests = await ManifestModel.find(query);
    return manifests;
  }

  @Mutation(() => Boolean)
  async resetAllManifests(): Promise<boolean> {
    try {
      const res = await ManifestModel.updateMany({}, { $pull: { seats: {} } }, { returnDocument: "after" });
      console.log(res);
      return true;
    } catch (err: any) {
      console.error(`Got error ${err} while resetting manifests`);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async resetToRandomManifests(): Promise<boolean> {
    try {
      const documents = await ManifestModel.find({});
      if (documents == null || documents.length == 0) {
        console.log(`No manifests found while resetting`);
        return true;
      }
      const ids = documents.map((d): ObjectId => d._id);
      const manifestMapping = ids.reduce((acc, id) => {
        acc.set(id.toHexString(), [...createRandomManifests(1)[0].seats]);
        return acc;
      }, new Map<string, Reservation[]>());

      const res = await ManifestModel.bulkWrite(
        Array.from(manifestMapping.entries()).map(([id, seats]) => ({
          updateOne: {
            filter: { _id: id },
            update: { seats },
          },
        })),
      );
      console.log(res);

      return true;
    } catch (err: any) {
      console.error(`Got error ${err} while resetting to random manifests`);
      return false;
    }
  }
}
