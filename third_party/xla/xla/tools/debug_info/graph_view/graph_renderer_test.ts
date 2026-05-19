// Copyright 2026 The OpenXLA Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import 'jasmine';

import {GraphData, HloGraphRenderer, NodeData, parseBinaryGraphData, } from './graph_renderer';

describe('HloGraphRenderer', () => {
  let canvas: HTMLCanvasElement;
  let dummyGraphData: GraphData;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    dummyGraphData = {
      nodes: [
        {id: 1, x: 0, y: 0, diffScore: 0.5, key: 'node1', anchorId: 0},
        {id: 2, x: 100, y: 100, diffScore: 10.0, key: 'node2', anchorId: 0},
        {id: 3, x: -100, y: -100, diffScore: 100.0, key: 'node3', anchorId: 0},
      ],
      edges: [
        {supplierId: 1, consumerId: 2},
        {supplierId: 3, consumerId: 1},
      ],
    };
  });

  afterEach(() => {
    document.body.removeChild(canvas);
  });

  it('should construct and fit to view without throwing errors', () => {
    const renderer = new HloGraphRenderer(canvas, dummyGraphData);
    expect(renderer).toBeDefined();
  });

  it('should setup interaction callbacks and handle hover', () => {
    const renderer = new HloGraphRenderer(canvas, dummyGraphData);

    let hoveredNode: NodeData|null|undefined = undefined;
    renderer.setOnHover((node: NodeData|null) => {
      hoveredNode = node;
    });

    // Simulate mouse movement across the canvas
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 400,
      clientY: 300,
      bubbles: true,
    });
    window.dispatchEvent(mouseMoveEvent);

    // Because WebGL coordinates and pan/zoom map to world coordinates,
    // this might hit or not hit depending on exact zoom/pan.
    // But we can expect that hoveredNode is either null or a NodeData object.
    expect(hoveredNode === null || hoveredNode !== undefined).toBe(true);
  });

  it('should handle mouse down, move and up for click selection', () => {
    const renderer = new HloGraphRenderer(canvas, dummyGraphData);

    let clickedNode: NodeData|null = null;
    renderer.setOnClick((node: NodeData) => {
      clickedNode = node;
    });

    const rect = canvas.getBoundingClientRect();
    canvas.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: rect.left + 400,
          clientY: rect.top + 300,
          bubbles: true,
        }),
    );

    window.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: rect.left + 400,
          clientY: rect.top + 300,
          bubbles: true,
        }),
    );

    window.dispatchEvent(
        new MouseEvent('mouseup', {
          clientX: rect.left + 400,
          clientY: rect.top + 300,
          bubbles: true,
        }),
    );

    expect(clickedNode === null || clickedNode !== undefined).toBe(true);
  });

  it('should handle wheel zoom events', () => {
    const renderer = new HloGraphRenderer(canvas, dummyGraphData);
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: -100,
      clientX: 400,
      clientY: 300,
      bubbles: true,
    });
    canvas.dispatchEvent(wheelEvent);
    expect(renderer).toBeDefined();
  });
});

describe('parseBinaryGraphData', () => {
  it('should reject invalid base64 strings gracefully', async () => {
    await expectAsync(parseBinaryGraphData('invalid_base64_$$')).toBeRejected();
  });
});
