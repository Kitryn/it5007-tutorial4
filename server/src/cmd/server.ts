import "reflect-metadata";
import mongoose from "mongoose";
import express from "express";
import { createRandomManifests, ManifestModel } from "../models/Manifest";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ManifestResolver } from "../resolvers/ManifestResolver";
import { ReservationResolver } from "../resolvers/ReservationResolver";

async function main() {
  const PORT = process.env.PORT ?? 3000;
  const url = process.env.CONNECTIONSTRING ?? "mongodb://localhost/trainbookings";
  const doMigrate = process.env.MIGRATE ?? "NO";

  console.log(`Connecting to ${url}`);
  const mg = await mongoose.connect(url);

  if (doMigrate === "YES") {
    console.log(`Dropping db`);
    await mg.connection.dropDatabase();

    const manifests = createRandomManifests(15);
    for (const m of manifests) {
      await ManifestModel.create(m);
    }
    console.log(`Inserted ${manifests.length} manifests`);
  }

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ManifestResolver, ReservationResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: true });

  app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  });
}

main();
