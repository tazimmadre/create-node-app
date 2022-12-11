#!/usr/bin/env node
import { promisify } from 'util';
import { join } from 'path';
import { mkdirSync, copyFileSync, unlinkSync, rmdirSync } from 'fs';
import { execSync } from 'child_process';
import childprocess from 'child_process'

// Utility functions
const exec = promisify(childprocess.exec);
async function runCmd (command) {
    try {
        const { stdout, stderr } = await exec(command);
        console.log(stdout);
        console.log(stderr);
    } catch {
        (error) => {
            console.log(error);
        };
    }
}

async function hasYarn () {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// Validate arguments
if (process.argv.length < 3) {
    console.log('Please specify the target project directory.');
    console.log('For example:');
    console.log('    npx node-app-generator my-app');
    console.log('    OR');
    console.log('    npm init node-app-generator my-app');
    process.exit(1);
}

// Define constants
const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = join(ownPath, folderName);
const repo = 'https://github.com/tazimmadre/create-node-app.git';

// Check if directory already exists
try {
    mkdirSync(appPath);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log('Directory already exists. Please choose another name for the project.');
    } else {
        console.log(err);
    }
    process.exit(1);
}

async function setup () {
    try {
        // Clone repo
        console.log(`Downloading files... ${repo}`);
        await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
        console.log('Downloaded successfully.');
        console.log('');

        // Change directory
        process.chdir(appPath);

        // Install dependencies
        const useYarn = await hasYarn();
        console.log('Installing dependencies...');
        if (useYarn) {
            await runCmd('yarn install');
        } else {
            await runCmd('npm install');
        }
        console.log('Dependencies installed successfully.');
        console.log();

        // Copy envornment variables
        copyFileSync(join(appPath, '.env.example'), join(appPath, '.env'));
        console.log('Environment files copied.');

        // Delete .git folder
        await runCmd('npx rimraf ./.git');

        // Remove extra files
        unlinkSync(join(appPath, 'CODE_OF_CONDUCT.md'));
        unlinkSync(join(appPath, 'CONTRIBUTING.md'));
        unlinkSync(join(appPath, 'bin', 'createNodeApp.js'));
        rmdirSync(join(appPath, 'bin'));
        if (!useYarn) {
            unlinkSync(join(appPath, 'yarn.lock'));
        }

        console.log('Installation is now complete!');
        console.log();

        console.log('We suggest that you start by typing:');
        console.log(`    cd ${folderName}`);
        console.log(useYarn ? '    yarn dev' : '    npm run dev');
        console.log();
        console.log('🚀🚀🚀...Enjoy your production-ready Node.js app, which already supports a large number of ready-made features!');
        console.log('')
        console.log('Buy me a Cofee :- https://www.buymeacoffee.com/tazimmadre');
        console.log('')
        console.log('Check README.md for more info.');
    } catch (error) {
        console.log(error);
    }
}

setup();