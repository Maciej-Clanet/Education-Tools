import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { usableCapacity, arraySurvives, xorBits, raidScenarios, evaluateRaidChoice, raidReferenceTable } from '../javascript/data/raid-storage-data.js';

test('capacity examples and invalid arrangements', () => {
  for (const [level, count, size, expected] of [['0',4,2,8],['1',2,2,2],['5',4,2,6],['6',6,2,8],['10',4,2,4]]) {
    assert.equal(usableCapacity(level,count,size),expected);
  }
  for (const [level,count,size] of [['5',2,2],['6',3,2],['10',5,2],['1',4,2],['0',2,-2],['unknown',4,2]]) assert.equal(usableCapacity(level,count,size),null);
});
test('failure limits including every two-drive RAID 10 combination', () => {
  assert.equal(arraySurvives('0',4,[0]),false);
  assert.equal(arraySurvives('1',2,[1]),true);
  assert.equal(arraySurvives('5',4,[2]),true);
  assert.equal(arraySurvives('5',4,[1,2]),false);
  assert.equal(arraySurvives('6',6,[1,4]),true);
  assert.equal(arraySurvives('6',6,[1,3,4]),false);
  for (let first=0;first<4;first++) for(let second=first+1;second<4;second++) {
    assert.equal(arraySurvives('10',4,[first,second]),Math.floor(first/2)!==Math.floor(second/2));
  }
});
test('parity reconstructs either missing input for all four-bit values', () => {
  assert.equal(xorBits('1','0'),'1');
  assert.equal(xorBits('1010','0110'),'1100');
  for(let a=0;a<16;a++) for(let b=0;b<16;b++) {
    const bitsA=a.toString(2).padStart(4,'0'),bitsB=b.toString(2).padStart(4,'0');
    const parity=xorBits(bitsA,bitsB);
    assert.equal(xorBits(bitsB,parity),bitsA);
    assert.equal(xorBits(bitsA,parity),bitsB);
  }
});
test('single-answer scenarios reject conflicting choices; open scenario accepts several defensible answers', () => {
  for(const scenario of raidScenarios) {
    for(const level of ['0','1','5','6','10']) assert.equal(evaluateRaidChoice(scenario.id,[level]).valid,scenario.valid.includes(level));
    assert.equal(evaluateRaidChoice(scenario.id,[]).valid,false);
  }
  assert.equal(evaluateRaidChoice('business',['5','6','10']).valid,true);
  assert.equal(evaluateRaidChoice('business',['5','0']).valid,false);
  assert.equal(evaluateRaidChoice('photo',['5','6']).valid,false);
});
test('lesson retains shell, complete reference, local assets and revised assessments', () => {
  const path=resolve('pages/topics/raid-and-nas-storage-systems.html');
  const html=readFileSync(path,'utf8');
  assert.equal((html.match(/data-lesson-section/g)||[]).length,32);
  assert.equal((html.match(/data-question="q/g)||[]).length,14);
  assert.equal((html.match(/data-exam-response=/g)||[]).length,4);
  assert.ok(html.includes(raidReferenceTable()));
  assert.ok(html.includes('data-action="next-slide"'));
  assert.ok(html.includes('data-role="lesson-sequence"'));
  assert.ok(html.endsWith('</body></html>'));
  assert.doesNotMatch(html,/Hamming|RAID 2/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const [,asset] of html.matchAll(/(?:src|href)="([^"?#]+\.(?:svg|js|css))"/g)) assert.ok(existsSync(resolve(dirname(path),asset)),asset);
});
