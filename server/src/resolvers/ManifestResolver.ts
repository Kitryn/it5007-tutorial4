import { Arg, Query, Resolver } from "type-graphql";
import { Manifest, ManifestModel } from "../models/Manifest";

@Resolver()
export class ManifestResolver {
  @Query(() => [Manifest])
  async manifests(@Arg("dateAfter", (type) => Date, { nullable: true }) dateAfter: Date | null): Promise<Manifest[]> {
    const query = dateAfter != null ? { date: { $gte: dateAfter } } : {};
    const manifests = await ManifestModel.find(query);
    return manifests;
  }
}
