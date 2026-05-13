/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SdkAgentFilesystem } from './fs.js';
import fs from 'node:fs/promises';
import type { Config as CoreConfig } from '@google/gemini-cli-core';

vi.mock('node:fs/promises');

describe('SdkAgentFilesystem', () => {
  let mockConfig: {
    validatePathAccess: ReturnType<typeof vi.fn>;
  };
  let agentFs: SdkAgentFilesystem;

  beforeEach(() => {
    vi.resetAllMocks();
    mockConfig = {
      validatePathAccess: vi.fn(),
    };
    agentFs = new SdkAgentFilesystem(mockConfig as unknown as CoreConfig);
  });

  describe('readFile', () => {
    it('reads a file successfully', async () => {
      mockConfig.validatePathAccess.mockReturnValue(null);
      vi.mocked(fs.readFile).mockResolvedValue('file content');

      const result = await agentFs.readFile('test.txt');

      expect(result).toBe('file content');
      expect(mockConfig.validatePathAccess).toHaveBeenCalledWith('test.txt', 'read');
      expect(fs.readFile).toHaveBeenCalledWith('test.txt', 'utf-8');
    });

    it('returns null if access is denied', async () => {
      mockConfig.validatePathAccess.mockReturnValue('Access denied');

      const result = await agentFs.readFile('forbidden.txt');

      expect(result).toBeNull();
      expect(fs.readFile).not.toHaveBeenCalled();
    });

    it('returns null if fs.readFile throws an error', async () => {
      mockConfig.validatePathAccess.mockReturnValue(null);
      vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));

      const result = await agentFs.readFile('nonexistent.txt');

      expect(result).toBeNull();
    });
  });

  describe('writeFile', () => {
    it('writes a file successfully', async () => {
      mockConfig.validatePathAccess.mockReturnValue(null);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await agentFs.writeFile('test.txt', 'new content');

      expect(fs.writeFile).toHaveBeenCalledWith('test.txt', 'new content', 'utf-8');
      expect(mockConfig.validatePathAccess).toHaveBeenCalledWith('test.txt', 'write');
    });

    it('throws an error if access is denied', async () => {
      mockConfig.validatePathAccess.mockReturnValue('Access denied');

      await expect(agentFs.writeFile('forbidden.txt', 'content')).rejects.toThrow('Access denied');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
