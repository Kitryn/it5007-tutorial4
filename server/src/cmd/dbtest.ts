import { Collection, Document, MongoClient, ObjectId } from "mongodb";
import { Manifest } from "../models/manifest";
import { Reservation } from "../models/reservation";

const url = process.env.CONNECTIONSTRING ?? "mongodb://localhost/trainbookings";

async function insertTestManifest(
  client: MongoClient,
  manifestCollection: Collection<Manifest>,
  counterCollection: Collection,
): Promise<ObjectId | null> {
  const session = client.startSession();
  let objectId = null;
  try {
    await session.withTransaction(async () => {
      const result = await counterCollection.findOneAndUpdate(
        {
          _id: "manifests",
        },
        { $inc: { current: 1 } },
        { returnDocument: "after", upsert: true },
      );

      if (result.value == null) {
        await session.abortTransaction();
        console.error(`Unable to get next id for manifests`);
        return;
      }

      const id: number = result.value.current;

      const manifest: Manifest = {
        id,
        date: new Date(2022, 0, 24, 16, 0, 0),
        seats: [
          {
            sn: 0,
            name: "Sally",
            phone: "9123 4567",
            date: new Date(2022, 0, 24, 0, 0, 0),
          },
        ],
      };

      const insResult = await manifestCollection.insertOne(manifest);
      objectId = insResult.insertedId;
    });

    if (objectId != null) {
      console.log(`Manifest successfully inserted`);
      console.log(objectId);
    } else {
      console.log(`Transaction aborted`);
    }
  } catch (err: any) {
    console.error(`Transaction aborted with error: ${err}`);
  } finally {
    await session.endSession();
  }
  return objectId;
}

// async function updateTestManifest(
//   client: MongoClient,
//   manifestCollection: Collection<Document>,
//   counterCollection: Collection<Document>,
//   objectIdToUpdate: ObjectId,
// ): Promise<ObjectId | null> {
//   const session = client.startSession();
//   let objectId = null;
//   try {
//     await session.withTransaction(async () => {

//     });
//   } catch (err: any) {
//     console.error(`Transaction aborted with error: ${err}`);
//   } finally {
//     await session.endSession();
//   }
//   return objectId;
// }

async function main() {
  console.log(`Starting mongodb initialization test`);

  const client = new MongoClient(url);
  await client.connect();
  console.log(`Connected to ${url}`);

  const db = client.db();

  const manifestCollection: Collection<Manifest> = db.collection("manifests");
  const _res = await manifestCollection.deleteMany({});
  console.log(
    `${_res.deletedCount} records found and deleted in collection manifests`,
  );

  const counterCollection = db.collection("counters");
  const _res2 = await counterCollection.deleteMany({});
  console.log(
    `${_res2.deletedCount} records found and deleted in collection counters`,
  );

  console.log(`=== Testing CREATE operations ===`);
  const insertedId = await insertTestManifest(
    client,
    manifestCollection,
    counterCollection,
  );

  if (insertedId == null) {
    throw new Error(`Did not create a new manifest successfully`);
  }
  console.log(`Inserted manifest with id ${insertedId}`);

  console.log(`=== Testing READ operations ===`);
  const readManifest = await manifestCollection.findOne({ _id: insertedId });
  if (readManifest == null) {
    throw new Error(
      `Unable to find the manifest just inserted with id ${insertedId}`,
    );
  }
  console.log(`Found manifest`);
  console.log(JSON.stringify(readManifest, null, 2));

  console.log(`=== Testing UPDATE operation ===`);
  const newReservation: Reservation = {
    sn: 1,
    name: "Nally",
    phone: "8123 4567",
    date: new Date(2022, 0, 24, 1, 0, 0),
  };
  const updateRes = await manifestCollection.findOneAndUpdate(
    { _id: insertedId },
    { $push: { seats: newReservation } },
    { returnDocument: "after" },
  );
  console.log(`Updated document ${insertedId}`);
  console.log(JSON.stringify(updateRes.value, null, 2));

  console.log(`=== Testing DELETE operation ===`);
  const deleteRes = await manifestCollection.deleteOne({ _id: insertedId });
  console.log(`Deleted ${deleteRes.deletedCount} rows`);

  if (deleteRes.deletedCount === 0) {
    throw new Error(`Did not delete anything!`);
  }
}

main()
  .then(() => {
    console.log("Finished testing, bye");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
