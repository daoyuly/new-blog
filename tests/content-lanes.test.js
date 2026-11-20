'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { laneOf, partition } = require('../lib/content-lanes');

test('skill matches before the paper pattern', () => {
  assert.equal(laneOf({
    title: 'OpenClaw Skill 每日推荐 - 媒体与流媒体',
    categories: [{ name: '技术推荐' }]
  }), 'skill');
});

test('teardown matches 项目深度分析 and 项目报告', () => {
  assert.equal(laneOf({ title: 'WKM 项目深度分析报告' }), 'teardown');
  assert.equal(laneOf({ title: 'translate-ai 项目报告书' }), 'teardown');
});

test('serial matches engineer diary and GPU diary before papers', () => {
  assert.equal(laneOf({ title: 'AI Agent 工程师 Day 62：Context Packing', categories: [{ name: '日报' }] }), 'serial');
  assert.equal(laneOf({ title: 'GPU 学习日报 Day 30' }), 'serial');
});

test('paper matches title or category when earlier lanes do not', () => {
  assert.equal(laneOf({ title: 'Agent 前沿论文综述', categories: [] }), 'paper');
  assert.equal(laneOf({ title: '一篇普通标题', categories: [{ name: '论文综述' }] }), 'paper');
});

test('everything else is an essay', () => {
  assert.equal(laneOf({ title: '芦苇之思(2026-11-19)', categories: [] }), 'essay');
});

test('partition sorts each lane by date descending', () => {
  const buckets = partition([
    { title: '甲 项目深度分析', date: '2026-01-01' },
    { title: '乙 项目深度分析', date: '2026-06-01' },
    { title: '随笔一篇', date: '2026-03-01' }
  ]);
  assert.deepEqual(buckets.teardown.map(post => post.title), ['乙 项目深度分析', '甲 项目深度分析']);
  assert.equal(buckets.essay.length, 1);
  assert.equal(buckets.paper.length, 0);
});
