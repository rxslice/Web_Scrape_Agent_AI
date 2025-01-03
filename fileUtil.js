/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
import { spawnSync } from 'child_process';
import { createReadStream } from 'fs';
import { mkdir, readdir } from 'fs/promises';
import * as path from 'path';
import extractZip from 'extract-zip';
import tar from 'tar-fs';
import bzip from 'unbzip2-stream';
/**
 * @internal
 */
export async function unpackArchive(archivePath, folderPath) {
    if (archivePath.endsWith('.zip')) {
        await extractZip(archivePath, { dir: folderPath });
    }
    else if (archivePath.endsWith('.tar.bz2')) {
        await extractTar(archivePath, folderPath);
    }
    else if (archivePath.endsWith('.dmg')) {
        await mkdir(folderPath);
        await installDMG(archivePath, folderPath);
    }
    else if (archivePath.endsWith('.exe')) {
        // Firefox on Windows.
        const result = spawnSync(archivePath, [`/ExtractDir=${folderPath}`], {
            env: {
                __compat_layer: 'RunAsInvoker',
            },
        });
        if (result.status !== 0) {
            throw new Error(`Failed to extract ${archivePath} to ${folderPath}: ${result.output}`);
        }
    }
    else {
        throw new Error(`Unsupported archive format: ${archivePath}`);
    }
}
/**
 * @internal
 */
function extractTar(tarPath, folderPath) {
    return new Promise((fulfill, reject) => {
        const tarStream = tar.extract(folderPath);
        tarStream.on('error', reject);
        tarStream.on('finish', fulfill);
        const readStream = createReadStream(tarPath);
        readStream.pipe(bzip()).pipe(tarStream);
    });
}
/**
 * @internal
 */
async function installDMG(dmgPath, folderPath) {
    const { stdout } = spawnSync(`hdiutil`, [
        'attach',
        '-nobrowse',
        '-noautoopen',
        dmgPath,
    ]);
    const volumes = stdout.toString('utf8').match(/\/Volumes\/(.*)/m);
    if (!volumes) {
        throw new Error(`Could not find volume path in ${stdout}`);
    }
    const mountPath = volumes[0];
    try {
        const fileNames = await readdir(mountPath);
        const appName = fileNames.find(item => {
            return typeof item === 'string' && item.endsWith('.app');
        });
        if (!appName) {
            throw new Error(`Cannot find app in ${mountPath}`);
        }
        const mountedPath = path.join(mountPath, appName);
        spawnSync('cp', ['-R', mountedPath, folderPath]);
    }
    finally {
        spawnSync('hdiutil', ['detach', mountPath, '-quiet']);
    }
}
//# sourceMappingURL=fileUtil.js.map