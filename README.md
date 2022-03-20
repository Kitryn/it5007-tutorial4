# it5007 tutorial 4

This project uses `yarn workspaces` to segregate client and server projects. It makes use of `docker-compose` to containerize and orchestrate both server and mongo instances.

Note: these steps assume you have `docker-compose` set up!

<span style="font-size:xx-large">WARNING: these steps will fail if you have a VPN on!</span>

Due to the way `docker network` works, please switch off VPN before attempting the below commands. See [stackoverflow](https://stackoverflow.com/questions/63259263/docker-not-working-with-a-vpn-due-to-network-issues) for issue details.

## Notes for TA

This repo uses `typegoose` to manage mongodb models and schema, and `type-graphql` to type graphql methods and resolvers. Since `type-graphql` generates the graphql schema based on type definitions, there is no `schema.graphql` file. Instead, graphql types and methods/resolvers are defined in `./server/src/resolvers`, and the object types are combined with `typegoose` models in `./server/src/models`, to avoid code duplication since the interfaces are one and the same, ensuring they can never go out of sync with each other. These definitions are also used by the client packages.

## Task 1: Running standalone script to test database logic (CRUD)

```
$ docker-compose -f docker-compose.yml -f docker-compose.dbtest.yml up --abort-on-container-exit --exit-code-from webapp --build
```

Expected output:

```
...
<snip>
...
webapp_1  | yarn run v1.22.17
webapp_1  | $ yarn workspace @it5007-tutorial4/server dbtest
webapp_1  | $ node ./dist/cmd/dbtest.js
webapp_1  | Connecting to mongodb://mongo:27017/trainbookings
webapp_1  | Dropping database
webapp_1  | === Testing CREATE operations ===
webapp_1  | {
webapp_1  |   date: 2022-01-24T16:00:00.000Z,
webapp_1  |   seats: [
webapp_1  |     {
webapp_1  |       sn: 0,
webapp_1  |       name: 'Sally',
webapp_1  |       phone: '9123 4567',
webapp_1  |       date: 2022-01-24T00:00:00.000Z,
webapp_1  |       _id: new ObjectId("6237391ae601c4e94c5ed4b6")
webapp_1  |     }
webapp_1  |   ],
webapp_1  |   _id: new ObjectId("6237391ae601c4e94c5ed4b5"),
webapp_1  |   __v: 0
webapp_1  | }
webapp_1  | Inserted manifest with id 6237391ae601c4e94c5ed4b5
webapp_1  | === Testing READ operations ===
webapp_1  | {
webapp_1  |   _id: new ObjectId("6237391ae601c4e94c5ed4b5"),
webapp_1  |   date: 2022-01-24T16:00:00.000Z,
webapp_1  |   seats: [
webapp_1  |     {
webapp_1  |       sn: 0,
webapp_1  |       name: 'Sally',
webapp_1  |       phone: '9123 4567',
webapp_1  |       date: 2022-01-24T00:00:00.000Z,
webapp_1  |       _id: new ObjectId("6237391ae601c4e94c5ed4b6")
webapp_1  |     }
webapp_1  |   ],
webapp_1  |   __v: 0
webapp_1  | } 0 [
webapp_1  |   {
webapp_1  |     _id: new ObjectId("6237391ae601c4e94c5ed4b5"),
webapp_1  |     date: 2022-01-24T16:00:00.000Z,
webapp_1  |     seats: [ [Object] ],
webapp_1  |     __v: 0
webapp_1  |   }
webapp_1  | ]
webapp_1  | === Testing UPDATE operation ===
webapp_1  | {
webapp_1  |   _id: new ObjectId("6237391ae601c4e94c5ed4b5"),
webapp_1  |   date: 2022-01-24T16:00:00.000Z,
webapp_1  |   seats: [
webapp_1  |     {
webapp_1  |       sn: 0,
webapp_1  |       name: 'Sally',
webapp_1  |       phone: '9123 4567',
webapp_1  |       date: 2022-01-24T00:00:00.000Z,
webapp_1  |       _id: new ObjectId("6237391ae601c4e94c5ed4b6")
webapp_1  |     },
webapp_1  |     {
webapp_1  |       sn: 1,
webapp_1  |       name: 'Nally',
webapp_1  |       phone: '8123 4567',
webapp_1  |       date: 2022-01-24T01:00:00.000Z,
webapp_1  |       _id: new ObjectId("6237391ae601c4e94c5ed4ba")
webapp_1  |     }
webapp_1  |   ],
webapp_1  |   __v: 0
webapp_1  | }
webapp_1  | === Testing DELETE operation ===
webapp_1  | { acknowledged: true, deletedCount: 1 }
webapp_1  | Finished testing, bye
webapp_1  | Done in 1.01s.
```

## Task 2: Railway Reservation Webapp

**Note**: If you have already run the above `docker-compose` command for dbtest, you probably already have the image built and can omit the `--build` flag. If you have not built the container, include the `--build` flag.

```
$ docker-compose -f docker-compose.yml up --abort-on-container-exit --exit-code-from webapp
```

## Local development

### Server

```
$ docker-compose up --abort-on-container-exit --exit-code-from webapp
```

### Client

Leave server running on localhost:3000 for local development; graphql queries will be made against it

```
$ yarn workspace @it5007-tutorial4/client start
```

## DB schema

This project uses `typegoose` to construct the database schema. Model files are under `./server/src/models`. An argument can be made for `Reservation` objects to be in their own separate table as opposed to an array under the `Manifest` document. Might be easier for indexing, searching, and uniqueness checks, though queries to fetch `Reservations` will take additional db calls.

```
export class Reservation {
  @prop({ required: true })
  sn!: number;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  phone!: string;

  @prop({ required: true })
  date!: Date;
}

export class Manifest {
  _id?: string;

  @prop({ required: true, index: true })
  date!: Date;

  @prop({ required: true, default: [], type: () => [Reservation] })
  seats!: Reservation[];
}
```

## Teardown

```
$ docker-compose down
```

Note that the `mongodb` and `mongodb_config` docker volumes will also need to be deleted.
