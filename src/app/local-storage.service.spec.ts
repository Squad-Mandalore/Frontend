import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
    let service: LocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set JSON and get data from localStorage', () => {
        const key = 'testKey';
        const testData = { message: 'Hello, World!' };

        service.setItem(key, testData);
        const retrievedData = service.getItem(key);

        expect(retrievedData).toEqual(testData);
    });

    it('should remove data from localStorage', () => {
        const key = 'testKey';
        const testData = { message: 'Hello, World!' };

        service.setItem(key, testData);
        service.removeItem(key);
        const retrievedData = service.getItem(key);

        expect(retrievedData).toBeNull();
    });

    it('should set string and get data from localStorage', () => {
        const key = 'testKey';
        const testData = 'Hello, World!';

        service.setItem(key, testData);
        const retrievedData = service.getItem(key);

        expect(retrievedData).toEqual(testData);
    });

    it('should set number and get data from localStorage', () => {
        const key = 'testKey';
        const testData = 1;

        service.setItem(key, testData);
        const retrievedData = service.getItem(key);

        expect(retrievedData).toEqual(testData);
    });

    it('should set Date and get data from localStorage', () => {
        const key = 'testKey';
        const testData = new Date(2348023468234234);

        service.setItem(key, testData);
        const retrievedData = service.getItem(key);

        expect(new Date(retrievedData)).toEqual(testData);
    });

    it('should clear data from localStorage', () => {
        const key = 'testKey';
        const testData = { message: 'Hello, World!' };
        const keyTwo = 'testKey2';
        const testDataTwo = { message: 'Hello, World!2' };

        service.setItem(key, testData);
        service.setItem(keyTwo, testDataTwo);
        service.clear()
        const retrievedData = service.getItem(key);
        const retrievedDataTwo = service.getItem(keyTwo);

        expect(retrievedData).toBeNull();
        expect(retrievedDataTwo).toBeNull();
    });
});
