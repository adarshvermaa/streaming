import express from 'express';
import fs from 'fs';
import path from 'path';

const routesPath = path.join(__dirname);

export async function loadRoutes(app: express.Application): Promise<void> {
    try {
        const folders = await fs.promises.readdir(routesPath);

        const validFolders = folders.filter((folder) => fs.statSync(path.join(routesPath, folder)).isDirectory());

        for (const folder of validFolders) {
            const folderPath = path.join(routesPath, folder);

            await loadFilesFromFolder(folderPath, folder, app);
        }
    } catch (err) {
        console.error('Error loading routes:', err);
    }
}

async function loadFilesFromFolder(folderPath: string, folderName: string, app: express.Application): Promise<void> {
    try {
        const filesAndFolders = await fs.promises.readdir(folderPath);

        for (const fileOrFolder of filesAndFolders) {
            const fullPath = path.join(folderPath, fileOrFolder);
            const stat = await fs.promises.stat(fullPath);

            if (stat.isDirectory()) {
                // Recursively load files from subfolders
                await loadFilesFromFolder(fullPath, `${folderName}/${fileOrFolder}`, app);
            } else if (fileOrFolder.endsWith('.route.ts')) {
                const route = require(fullPath).default;

                if (route && typeof route === 'function') {
                    const routeUrl = generateRouteUrl(folderName, fileOrFolder);
                    app.use(routeUrl, route);
                    console.log(`Route loaded: ${routeUrl}`);
                } else {
                    console.warn(`Skipping invalid route file: ${fullPath}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error loading files from folder ${folderPath}:`, err);
    }
}
function generateRouteUrl(folder: string, file: string): string {
    const fileNameWithoutExtension = file.replace('.route.ts', '').toLowerCase();
    const folderParts = folder.split('/');

    if (folderParts.includes(fileNameWithoutExtension)) {
        return `/api/${folderParts.reverse().join('/')}`;
    }
    return `/api/${folderParts.reverse().join('/')}/${fileNameWithoutExtension}`;
}

