import test from 'node:test'
import assert from 'node:assert/strict'
import { MONO_ARROW, COLOUR_ARROW, IMAGE_PALETTE, bitmapPixelData, bitmapScenarios } from '../javascript/data/bitmap-image-model.js'
import { evaluateScenarioPair } from '../javascript/core/paired-scenarios.js'

test('the authored bitmap examples have 32 positions with valid colour interpretations',()=>{
 assert.equal(MONO_ARROW.length,32)
 assert.equal(COLOUR_ARROW.length,32)
 assert.ok(MONO_ARROW.every(value=>value===0||value===1))
 assert.ok(COLOUR_ARROW.every(value=>IMAGE_PALETTE[value]))
 assert.equal(new Set(IMAGE_PALETTE.map(entry=>entry.code)).size,4)
 assert.equal(COLOUR_ARROW.filter(value=>value===2).length,4)
})
test('worked pixel-data figures and fixed-dimension depth effects are exact',()=>{
 assert.deepEqual(bitmapPixelData(8,4,1),{pixels:32,bits:32,bytes:4})
 assert.deepEqual(bitmapPixelData(8,4,2),{pixels:32,bits:64,bytes:8})
 assert.deepEqual(bitmapPixelData(12,8,2),{pixels:96,bits:192,bytes:24})
 assert.equal(bitmapPixelData(8,4,8).bits,8*bitmapPixelData(8,4,1).bits)
 assert.equal(bitmapPixelData(8,4,8).pixels,bitmapPixelData(8,4,1).pixels)
})
test('invalid dimensions and depths cannot produce misleading size estimates',()=>{
 for(const values of [[0,4,1],[8,-1,2],[8,4,0],[8.5,4,2],[8,4,NaN],[Number.MAX_SAFE_INTEGER,2,8]])assert.throws(()=>bitmapPixelData(...values),RangeError)
})
test('scenario choices require the reason to match the image requirement',()=>{
 assert.equal(evaluateScenarioPair('bitmap','detail',bitmapScenarios['museum-photo'].acceptedPairs),true)
 assert.equal(evaluateScenarioPair('vector','shapes',bitmapScenarios['route-diagram'].acceptedPairs),true)
 for(const config of Object.values(bitmapScenarios))for(const representation of ['bitmap','vector'])assert.equal(evaluateScenarioPair(representation,'always-small',config.acceptedPairs),false)
 assert.equal(evaluateScenarioPair('bitmap','shapes',bitmapScenarios['museum-photo'].acceptedPairs),false)
})
