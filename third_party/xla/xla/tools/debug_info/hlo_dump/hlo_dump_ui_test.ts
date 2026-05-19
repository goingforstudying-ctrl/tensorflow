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

import {TEST_ONLY} from './hlo_dump_ui';

const {renderTooltip} = TEST_ONLY;

describe('renderTooltip', () => {
  it('renders string content directly', () => {
    const result = renderTooltip('hello world');
    expect(result).toBe('hello world');
  });

  it('renders structured content with diffScore', () => {
    const content = {
      diffScore: {
        min: 0.1,
        max: 0.9,
        mean: 0.5,
        count: 10,
      },
    };
    const result = renderTooltip(content);
    expect(result).toContain('Diff Score:');
    expect(result).toContain('0.1');
    expect(result).toContain('0.9');
    expect(result).toContain('0.5');
    expect(result).toContain('10');
  });

  it('renders structured content with metrics', () => {
    const content = {
      metrics: {
        'Mean': {baseline: 10, target: 20},
        'Max': {baseline: 5, target: 5},
      },
    };
    const result = renderTooltip(content);
    expect(result).toContain('Metrics');
    expect(result).toContain('Mean');
    expect(result).toContain('10');
    expect(result).toContain('20');
  });

  it('handles notComparable', () => {
    const content = {
      diffScore: {
        notComparable: true,
      },
    };
    const result = renderTooltip(content);
    expect(result).toContain('Not Comparable');
  });
});
