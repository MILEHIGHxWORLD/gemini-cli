/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateDnsResolutionOrder } from './dns.js';
import { debugLogger } from '@google/gemini-cli-core';

describe('validateDnsResolutionOrder', () => {
  let debugLoggerWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debugLoggerWarnSpy = vi
      .spyOn(debugLogger, 'warn')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return "ipv4first" when the input is "ipv4first"', () => {
    expect(validateDnsResolutionOrder('ipv4first')).toBe('ipv4first');
    expect(debugLoggerWarnSpy).not.toHaveBeenCalled();
  });

  it('should return "verbatim" when the input is "verbatim"', () => {
    expect(validateDnsResolutionOrder('verbatim')).toBe('verbatim');
    expect(debugLoggerWarnSpy).not.toHaveBeenCalled();
  });

  it('should return the default "ipv4first" when the input is undefined', () => {
    expect(validateDnsResolutionOrder(undefined)).toBe('ipv4first');
    expect(debugLoggerWarnSpy).not.toHaveBeenCalled();
  });

  it('should return the default "ipv4first" and log a warning for an invalid string', () => {
    expect(validateDnsResolutionOrder('invalid-value')).toBe('ipv4first');
    expect(debugLoggerWarnSpy).toHaveBeenCalledExactlyOnceWith(
      'Invalid value for dnsResolutionOrder in settings: "invalid-value". Using default "ipv4first".',
    );
  });

  it('should return the default "ipv4first" and log a warning for an empty string', () => {
    expect(validateDnsResolutionOrder('')).toBe('ipv4first');
    expect(debugLoggerWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid value for dnsResolutionOrder'),
    );
  });

  it('should handle case sensitivity (assuming it must be exact match)', () => {
    expect(validateDnsResolutionOrder('IPv4First')).toBe('ipv4first');
    expect(debugLoggerWarnSpy).toHaveBeenCalled();
  });
});
