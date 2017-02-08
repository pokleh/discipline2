'use strict';

export const LOAD_TEST_DATA = 'LOAD_INIT';

export const loadTestData = () => {
  let trackers = depot.loadTestData();
  return {
    type: LOAD_TEST_DATA,
    trackers
  }
};

export const REMOVE_TRACKER = 'REMOVE_TRACK';

export const removeTracker = tracker => {
  depot.removeTracker(tracker.id);
  return {
    type: REMOVE_TRACKER,
    tracker
  }
};

export const ADD_TRACKER = 'ADD_TRACKER';

export const addTracker = (tracker, index) => {
  tracker = depot.addTrackerAt(tracker, index);
  return {
    type: ADD_TRACKER,
    tracker,
    index
  }
};

export const UPDATE_TRACKER = 'UPDATE_TRACKER';

export const updateTracker = (tracker) => {
  depot.updateTracker(tracker);
  return {
    type: UPDATE_TRACKER,
    tracker
  }
};

export const TICK_TRACKER = 'TICK_TRACKER';

export const tickTracker = (tracker, value) => {
  let dateTimeMs = time.getDateTimeMs();
  let tick = depot.addTick(tracker.id, dateTimeMs, value);
  return {
    type: TICK_TRACKER,
    tracker,
    tick
  }
};

export const UNDO_LAST_TICK = 'UNDO_LAST_TICK';

export const undoLastTick = tracker => {
  depot.undoLastTick(tracker.id);
  return {
    type: UNDO_LAST_TICK,
    tracker
  }
};

export const UPDATE_LAST_TICK = 'UPDATE_LAST_TICK';

export const updateLastTick = (tracker, value) => {
  depot.updLastTick(tracker.id, value);
  return {
    type: UPDATE_LAST_TICK,
    tracker
  }
};