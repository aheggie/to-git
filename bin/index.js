#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");

//these are paths used in all commands
//node automatically sets them relative to process.cwd()
const DIRECTORY_PATH = "./.to-git";
const TODO_PATH = `${DIRECTORY_PATH}/todo`;
const DOING_PATH = `${DIRECTORY_PATH}/doing`;

const alreadyInitted = () => fs.existsSync(DIRECTORY_PATH);
const onlyRunIfInitted = (callback) => {
  if (alreadyInitted) {
    return callback();
  } else {
    console.error("to-git filestructure not created yet");
  }
};

const splitLinesToArraySync = (filePath) =>
  fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    //to remove last line usually, plus any other line that might not have an item
    .filter((item) => item.length > 0);

const lineNumToLetter = (num) => String.fromCharCode(65 + num);

const program = new Command();

program.version("0.0.3").name("to-git");

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
  .action((message) =>
    onlyRunIfInitted(() => {
      fs.appendFileSync(TODO_PATH, `${message}\n`);
      console.log(`new todo item: "${message}"`);
    })
  );

program
  .command("view <list>")
  .alias("v")
  .description(
    "View the todo, doing, and done lists individually. Usage: to-git view [todo|doing|done]"
  )
  .action((list) =>
    onlyRunIfInitted(() => {
      if (list === "todo") {
        splitLinesToArraySync(TODO_PATH).forEach((line, num) =>
          console.log(num, line)
        );
      } else if (list === "doing") {
        splitLinesToArraySync(DOING_PATH).forEach((line, num) => {
          console.log(lineNumToLetter(num), line);
        });
      } else if (list === "done") {
        console.log("view done not implemented yet");
      } else {
        console.error(
          `Unknown command: view ${list}. Usage of view command: to-git view [todo|doing|done]`
        );
      }
    })
  );

program.parse(process.argv);
