import test from 'node:test';
import assert from 'node:assert/strict';
import { getSceneFrame, getEntryFrame, getApproachStage } from '../motion.js';

test('hero starts in perspective and settles within the first half viewport', () => {
  const start = getSceneFrame(0, 1000);
  assert.equal(start.rotateX, 17);
  assert.equal(start.rotateY, -23);
  assert.equal(start.scale, 0.9);
  const middle = getSceneFrame(200, 1000);
  assert.ok(middle.rotateX < start.rotateX && middle.rotateX > 0);
  assert.ok(middle.scale > start.scale && middle.scale < 1);
  const complete = getSceneFrame(480, 1000);
  assert.equal(complete.rotateX, 0);
  assert.equal(Math.abs(complete.rotateY), 0);
  assert.equal(complete.scale, 1);
  assert.equal(complete.spread, 0);
});

test('overscroll and zero-sized viewports never produce invalid transforms', () => {
  for (const height of [0, 1, 568, 1000]) {
    for (const offset of [-500, 0, 100, 1e6]) {
      const frame = getSceneFrame(offset, height);
      assert.ok(Object.values(frame).every(Number.isFinite));
      assert.ok(frame.scale >= 0.9 && frame.scale <= 1);
      assert.ok(frame.progress >= 0 && frame.progress <= 1);
    }
  }
});

test('scrolling back restores the same animation state', () => {
  const forward = getSceneFrame(160, 844);
  getSceneFrame(900, 844);
  assert.deepEqual(getSceneFrame(160, 844), forward);
});

test('reduced motion always uses the fully settled hero and project cards', () => {
  for (const offset of [0, 100, 10000]) {
    const frame = getSceneFrame(offset, 844, true);
    assert.equal(frame.rotateX, 0);
    assert.equal(Math.abs(frame.rotateY), 0);
    assert.equal(frame.scale, 1);
    assert.equal(frame.spread, 0);
    assert.deepEqual(getEntryFrame(offset, 844, true), { rotateX: 0, offset: 0 });
  }
});

test('project cards settle before reaching the top of the viewport', () => {
  assert.deepEqual(getEntryFrame(1100, 1000), { rotateX: 9, offset: 26 });
  assert.deepEqual(getEntryFrame(400, 1000), { rotateX: 0, offset: 0 });
  assert.deepEqual(getEntryFrame(-500, 1000), { rotateX: 0, offset: 0 });
});

test('short scroll sequence advances through each tab and reverses predictably', () => {
  assert.equal(getApproachStage(500, 110, 240), 0);
  assert.equal(getApproachStage(110, 110, 240), 0);
  assert.equal(getApproachStage(30, 110, 240), 1);
  assert.equal(getApproachStage(-50, 110, 240), 2);
  assert.equal(getApproachStage(-2000, 110, 240), 2);
  assert.equal(getApproachStage(30, 110, 240), 1);
  assert.equal(getApproachStage(110, 110, 240), 0);
});

test('mobile and zero-length scroll tracks stay within the available tabs', () => {
  assert.equal(getApproachStage(26, 86, 180), 1);
  assert.equal(getApproachStage(-34, 86, 180), 2);
  assert.equal(getApproachStage(-100, 86, 0), 2);
  assert.equal(getApproachStage(-100, 86, 180, 1), 0);
});
