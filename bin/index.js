#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");

//these are paths used in all commands
//node automatically sets them relative to process.cwd()
const DIRECTORY_PATH = "./.to-git";
const TODO_PATH = `${DIRECTORY_PATH}/todo`;
const DOING_PATH = `${DIRECTORY_PATH}/doing`;

const alreadyInitted = () => fs.existsSync(DIRECTORY_PATH);

const program = new Command();

program.version("0.0.1");

program
  .command("init")
  .alias("i")
  .description("initialise to-git on a project (call at the root of a repo)")
  .action(() => {
    // possible changes:
    // make async maybe
    // promisify?
    // search up directory tree to find root of repo where git is an ask to init there?

    // check if already exists
    if (!alreadyInitted()) {
      //this errors if the directory already exists
      fs.mkdirSync("./.to-git");
      //this creates an empty file if the file doesnt exist and avoids overwriting anything if it doesn't exist
      //not sure if this is really the best way to "touch" a new file with fs but it works and is non-destructive
      fs.appendFileSync(TODO_PATH, "");
      fs.appendFileSync(DOING_PATH, "");
      console.log(`To-git initted in ${process.cwd()}`);
    } else {
      console.error("to-git filestructure already exists in this repo");
    }
  });

program
  .command("todo <message>")
  .alias("t")
  .description("Add a new future commit message to the to do list")
  .action((message) => {
    if (alreadyInitted()) {
      fs.appendFileSync(TODO_PATH, `${message}\n`);
      console.log(`new todo item: "${message}"`);
    } else {
      console.error("to-git filestructure not created yet");
    }
  });

program.parse(process.argv);
