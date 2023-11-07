// import path = require('path');
import * as path from 'path';
import { checkApp } from '../../checker/app-checker';
import { AppCheckerError } from '../../errors/AppCheckerError';
import { AppError } from '../../errors/AppError';

const assetsDir = path.join(__dirname, 'assets');

test('File not found, should throw', async () => {
  await expect(async () => {
    await checkApp(path.join(assetsDir, 'blakajsjdhiqeni.zip'));
  }).rejects.toThrow();
});

test('not a compressed file, should throw', async () => {
  await expect(async () => {
    await checkApp(path.join(assetsDir, 'notazip.txt'));
  }).rejects.toThrowError(
    new AppCheckerError('Can not read the zip, is it a zip?'),
  );
});

test('empty zip, should throw', async () => {
  const errorMessage = 'File package.json not found';
  await expect(async () => {
    await checkApp(path.join(assetsDir, 'emptyZip.zip'));
  }).rejects.toThrowError(new AppCheckerError(errorMessage));
  await expect(async () => {
    await checkApp(path.join(assetsDir, 'emptyZip'));
  }).rejects.toThrowError(new AppCheckerError(errorMessage));
});

test('good zip, should not throw', async () => {
  await checkApp(path.join(assetsDir, 'goodZip.zip'));
  await checkApp(path.join(assetsDir, 'goodZip'));
});
