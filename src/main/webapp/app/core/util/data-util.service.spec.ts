import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { DataUtils } from './data-util.service';

describe('Data Utils Service Test', () => {
  let service: DataUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataUtils],
    });
    service = TestBed.inject(DataUtils);
  });

  describe('byteSize', () => {
    it('should return the bytesize of the text', () => {
      expect(service.byteSize('Hello JHipster')).toBe('10.5 bytes');
    });
  });

  describe('openFile', () => {
    // 'JHipster' in base64 is 'SkhpcHN0ZXI='
    const data = 'SkhpcHN0ZXI=';

    beforeEach(() => {
      const newWindow = { ...window };
      window.open = vi.fn(() => newWindow);
      window.URL.createObjectURL = vi.fn();
    });

    it('should open an image blob in the new window', () => {
      service.openFile(data, 'image/png', 'image');
      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'image/png' }));
    });

    it('should open an xml image blob as a download', () => {
      service.openFile(data, 'image/svg+xml', 'image');
      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'application/octet-stream' }));
    });

    it('should open a text blob in the new window', () => {
      service.openFile(data, 'text/plain', 'text');
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'text/plain' }));
    });

    it('should open a non plain text blob as a download', () => {
      service.openFile(data, 'text/html', 'text');
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'application/octet-stream' }));
    });

    it('should open any blob as a download', () => {
      service.openFile(data, 'application/pdf');
      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.objectContaining({ type: 'application/octet-stream' }));
    });
  });
});
