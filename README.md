# it5007 tutorial 4

This project uses `yarn workspaces` to segregate client and server projects. It makes use of `docker-compose` to containerize and orchestrate both server and mongo instances.

Note: these steps assume you have `docker-compose` set up!

<span style="font-size:xx-large">WARNING: these steps will fail if you have a VPN on!</span>

Due to the way `docker network` works, please switch off VPN before attempting the below commands. See [stackoverflow](https://stackoverflow.com/questions/63259263/docker-not-working-with-a-vpn-due-to-network-issues) for issue details.

## Task 1: Running standalone script to test database logic (CRUD)

```
$ docker-compose -f docker-compose.yml -f docker-compose.dbtest.yml up --abort-on-container-exit --exit-code-from webapp --build
```

Expected output:

```
webapp_1  | yarn run v1.22.17
webapp_1  | $ yarn workspace @it5007-tutorial4/server dbtest
webapp_1  | $ node ./dist/cmd/dbtest.js
webapp_1  | Starting mongodb initialization test
webapp_1  | Connected to mongodb://mongo:27017/trainbookings
webapp_1  | 0 records found and deleted in collection manifests
webapp_1  | 0 records found and deleted in collection counters
webapp_1  | === Testing CREATE operations ===
webapp_1  | Manifest successfully inserted
webapp_1  | new ObjectId("62239c7491209806a3f4def2")
webapp_1  | Inserted manifest with id 62239c7491209806a3f4def2
webapp_1  | === Testing READ operations ===
webapp_1  | Found manifest
webapp_1  | {
webapp_1  |   "_id": "62239c7491209806a3f4def2",
webapp_1  |   "id": 1,
webapp_1  |   "date": "2022-01-24T16:00:00.000Z",
webapp_1  |   "seats": [
webapp_1  |     {
webapp_1  |       "sn": 0,
webapp_1  |       "name": "Sally",
webapp_1  |       "phone": "9123 4567",
webapp_1  |       "date": "2022-01-24T00:00:00.000Z"
webapp_1  |     }
webapp_1  |   ]
webapp_1  | }
webapp_1  | === Testing UPDATE operation ===
webapp_1  | Updated document 62239c7491209806a3f4def2
webapp_1  | {
webapp_1  |   "_id": "62239c7491209806a3f4def2",
webapp_1  |   "id": 1,
webapp_1  |   "date": "2022-01-24T16:00:00.000Z",
webapp_1  |   "seats": [
webapp_1  |     {
webapp_1  |       "sn": 0,
webapp_1  |       "name": "Sally",
webapp_1  |       "phone": "9123 4567",
webapp_1  |       "date": "2022-01-24T00:00:00.000Z"
webapp_1  |     },
webapp_1  |     {
webapp_1  |       "sn": 1,
webapp_1  |       "name": "Nally",
webapp_1  |       "phone": "8123 4567",
webapp_1  |       "date": "2022-01-24T01:00:00.000Z"
webapp_1  |     }
webapp_1  |   ]
webapp_1  | }
webapp_1  | === Testing DELETE operation ===
webapp_1  | Deleted 1 rows
webapp_1  | Finished testing, bye
webapp_1  | Done in 0.79s.
```

## Task 2: Railway Reservation Webapp

**Note**: If you have already run the above `docker-compose` command for dbtest, you probably already have the image built and can omit the `--build` flag

```

```

## Local development

### Client

```

```

### Server

```
$ docker-compose -f docker-compose.dev.yml up --abort-on-container-exit --exit-code-from webapp
```

## DB schema

We don't use `mongoose` in here, but if we were:

### manifests

```js
const manifestSchema = new Schema({
  id: { type: Number, index: { unique: true } },
  date: { type: Date, index: true },
  seats: [
    {
      sn: Number,
      name: { type: String, index: true },
      phone: { type: String, index: true },
      date: { type: Date, default: Date.now },
    },
  ],
});
```

### counters

```js
const counterSchema = new Schema({
  _id: { type: String, index: { unique: true } },
  current: Number,
});
```

## Teardown

```
docker-compose down
```

Note that the `mongodb` and `mongodb_config` docker volumes will also need to be deleted.
