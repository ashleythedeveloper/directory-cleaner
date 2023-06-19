# Directory Cleaner

Directory Cleaner is a command line tool that checks every file in a specified directory (and subdirectories) and deletes any file that doesn't match the specified file types. If all the files in a directory are deleted, it also deletes the folder. The tool also checks if the file is empty. If it is, it deletes the file even if it's included in the list of specified file types.

## Installation

To get started, first make sure you have [Node.js](https://nodejs.org) installed.

Next, clone the repository to your local machine.

```bash
git clone https://github.com/ashleythedeveloper/directory-cleaner.git
```

Navigate to the project's root directory.

```bash
cd directory-cleaner
```

Now, install the necessary Node.js dependencies using Yarn:

```bash
yarn install
```

This command installs the required dependencies as defined in the `package.json` file, which includes `ts-node`, `typescript` and `yargs`.

## Running the tool

To run the tool, you can now use the `yarn start` command followed by the necessary flags.

Here's an example:

```bash
yarn start --dir /path/to/directory --files .md .txt .js
```

Replace `/path/to/directory` with the path to the directory you want to clean, and `.md .txt .js` with the file extensions of the files you want to keep. You can list as many file types as you want.

Once the scan is complete, the tool will display a list of files and directories to be deleted and ask for your confirmation:

```bash
The following files and directories will be deleted:
/path/to/your/directory/file1.txt
/path/to/your/directory/subdirectory
Are you sure you want to continue? (Y/n)
```

If you respond with Y, the tool will proceed to delete the listed files and directories. If you respond with n, the tool will cancel the deletion.

Please use this tool responsibly, as the deletion process is irreversible.
