 /* @flow */

'use strict';

import Realm from 'realm';

const AppInfoSchema = {
  name: 'AppInfo',
  properties: {
    ver: 'string',
    testTrackers: {
      type: 'list',
      objectType: 'Tracker',
      default: [],
    },
  }
};

const TrackerSchema = {
  name: 'Tracker',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    typeId: 'string',
    iconId: 'string',
  },
};

const TrackersSchema = {
  name: 'Trackers',
  properties: {
    nextId: {
      type: 'int',
      default: 1,
    },
    trackers: {
      type: 'list',
      objectType: 'Tracker',
      default: [],
    },
  },
};

const TicksSchema = {
  name: 'Ticks',
  properties: {
    nextId: {
      type: 'int',
      default: 1,
    },
  },
};

const TickSchema = {
  name: 'Tick',
  primaryKey: 'id',
  properties: {
    id: 'int',
    trackId: {
      type: 'int',
      indexed: true,
    },
    dateTimeMs: {
      type: 'int',
      indexed: true,
    },
    value: {
      type: 'float',
      optional: true,
    },
  },
};

const DistanceDataSchema = {
  name: 'DistData',
  properties: {
    tickId: {
      type: 'int',
      indexed: true,
    },
    time: {
      type: 'int',
    },
  },
};

const DB = new Realm({
  schema: [
    AppInfoSchema, TrackersSchema, TrackerSchema,
    TickSchema, TicksSchema, DistanceDataSchema,
  ],
});
export default DB;
