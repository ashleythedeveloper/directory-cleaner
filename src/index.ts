import * as fs from "fs";
import * as path from "path";
import readline from "readline";
import * as yargs from "yargs";

interface FileOrDir {
  path: string;
  isDir: boolean;
}

function findFilesToDelete(
  directoryPath: string,
  fileTypes: string[],
  filesToDelete: FileOrDir[] = []
) {
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stat = fs.lstatSync(filePath);

      if (stat.isDirectory()) {
        findFilesToDelete(filePath, fileTypes, filesToDelete);
      } else {
        if (!fileTypes.includes(path.extname(file)) || stat.size === 0) {
          filesToDelete.push({ path: filePath, isDir: false });
        }
      }
    }
  } else {
    console.log(`Directory ${directoryPath} does not exist`);
  }
}

function findEmptyDirs(directoryPath: string, emptyDirs: FileOrDir[] = []) {
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stat = fs.lstatSync(filePath);

      if (stat.isDirectory()) {
        findEmptyDirs(filePath, emptyDirs);
      }
    }

    if (fs.readdirSync(directoryPath).length === 0) {
      emptyDirs.push({ path: directoryPath, isDir: true });
    }
  }
}

function deleteFilesAndDirs(filesOrDirs: FileOrDir[]) {
  for (const fileOrDir of filesOrDirs) {
    if (fileOrDir.isDir) {
      fs.rmdirSync(fileOrDir.path);
    } else {
      fs.unlinkSync(fileOrDir.path);
    }
  }
}

function confirmAndDelete(
  filesToDelete: FileOrDir[],
  emptyDirs: FileOrDir[],
  dir: string
) {
  if (filesToDelete.length === 0 && emptyDirs.length === 0) {
    console.log("No files or directories to delete");
    return;
  }

  console.log("The following files and directories will be deleted:");
  [...filesToDelete, ...emptyDirs].forEach((fileOrDir) => {
    console.log(fileOrDir.path);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Are you sure you want to continue? (Y/n) ", (answer) => {
    if (answer.toLowerCase() === "y") {
      deleteFilesAndDirs(filesToDelete);

      const moreEmptyDirs: FileOrDir[] = [];
      findEmptyDirs(dir, moreEmptyDirs);
      deleteFilesAndDirs(moreEmptyDirs);

      console.log("Deletion completed");
    } else {
      console.log("Deletion cancelled");
    }
    rl.close();
  });
}

async function run() {
  const argv = await yargs.options({
    dir: { type: "string", demandOption: true, describe: "Directory path" },
    files: { type: "array", demandOption: true, describe: "File types" },
  }).argv;

  const { dir, files } = argv as any;
  const filesToDelete: FileOrDir[] = [];
  const emptyDirs: FileOrDir[] = [];

  findFilesToDelete(dir, files as string[], filesToDelete);
  findEmptyDirs(dir, emptyDirs);

  confirmAndDelete(filesToDelete, emptyDirs, dir);
}

run();
