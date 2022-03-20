import { gql } from "@apollo/client";
import {
  Manifest as ManifestModel,
  Reservation as ReservationModel,
  ReservationInput as ReservationInputModel,
  DeletedConfirmation as DeletedConfirmationModel,
  ReservationConfirmation as ReservationConfirmationModel,
  BlacklistEntry as BlacklistEntryModel,
} from "@it5007-tutorial4/server";

export interface Manifest extends ManifestModel {
  _id: string;
}

export interface Reservation extends Partial<ReservationModel> {}

export interface ReservationInput extends ReservationInputModel {}

export interface DeletedConfirmation extends DeletedConfirmationModel {}

export interface ReservationConfirmation extends ReservationConfirmationModel {}

export interface BlacklistEntry extends BlacklistEntryModel {}

export const MAX_SEATS_PER_TRAIN = 25;
export const SEAT_NUMBERS = new Set(
  Array(MAX_SEATS_PER_TRAIN)
    .fill(null)
    .map((_, i) => i),
);

export const MANIFESTS = gql`
  query Manifests($dateAfter: DateTime) {
    manifests(dateAfter: $dateAfter) {
      _id
      date
      seats {
        name
        phone
        date
        sn
      }
    }
  }
`;

export const RESET_ALL = gql`
  mutation ResetAll {
    resetAllManifests
  }
`;

export const RESET_TO_RANDOM = gql`
  mutation ResetToRandom {
    resetToRandomManifests
  }
`;

export const ADD_RESERVATION = gql`
  mutation AddReservation($reservation: ReservationInput!, $manifestId: ID!) {
    addReservation(reservation: $reservation, manifestId: $manifestId) {
      manifestId
      status
      manifest {
        _id
        date
        seats {
          sn
          name
          phone
          date
        }
      }
    }
  }
`;

export const DELETE_RESERVATION = gql`
  mutation DeleteReservation($seats: [Int!]!, $manifestId: ID!) {
    deleteReservation(seats: $seats, manifestId: $manifestId) {
      manifestId
      status
      seats {
        sn
        status
      }
    }
  }
`;

export const GET_BLACKLIST = gql`
  query Query {
    getBlacklist {
      _id
      name
    }
  }
`;

export const ADD_TO_BLACKLIST = gql`
  mutation AddNameToBlacklist($name: String!) {
    addNameToBlacklist(name: $name)
  }
`;

export const DELETE_NAME_FROM_BLACKLIST = gql`
  mutation DeleteNameFromBlacklist($name: String!) {
    deleteNameFromBlacklist(name: $name)
  }
`;

export const DELETE_ALL_FROM_BLACKLIST = gql`
  mutation Mutation {
    deleteAllFromBlacklist
  }
`;
