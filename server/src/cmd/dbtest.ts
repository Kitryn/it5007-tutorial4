import "reflect-metadata";
import mongoose from "mongoose";
import { Manifest, ManifestModel } from "../models/Manifest";
import { Reservation } from "../models/Reservation";

async function main() {
  const url = process.env.CONNECTIONSTRING ?? "mongodb://localhost/trainbookings";

  console.log(`Connecting to ${url}`);
  const mg = await mongoose.connect(url);

  console.log(`Dropping database`);
  await mg.connection.dropDatabase();

  console.log(`=== Testing CREATE operations ===`);
  const testManifest: Manifest = {
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

  const res1 = await ManifestModel.create(testManifest);

  console.log(res1);
  console.log(`Inserted manifest with id ${res1._id}`);

  console.log(`=== Testing READ operations ===`);
  const res2 = await ManifestModel.find({});
  res2.forEach(console.log);

  console.log(`=== Testing UPDATE operation ===`);
  const newReservation: Reservation = {
    sn: 1,
    name: "Nally",
    phone: "8123 4567",
    date: new Date(2022, 0, 24, 1, 0, 0),
  };

  const res3 = await ManifestModel.addReservation(res1._id, newReservation);
  console.log(res3);

  console.log(`=== Testing DELETE operation ===`);
  const res4 = await ManifestModel.deleteOne({ _id: res1._id });
  console.log(res4);

  if (res4.deletedCount == 0) {
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
