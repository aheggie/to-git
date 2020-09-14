#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const {
  alreadyInitted,
  onlyRunIfInitted,
  splitLinesToArraySync,
  lineNumToLetter,
} = require("../src/utilities");

//these are paths used in all commands
//node automatically sets them relative to process.cwd()
const DIRECTORY_PATH = "./.to-git";
const TODO_PATH = `${DIRECTORY_PATH}/todo`;
const DOING_PATH = `${DIRECTORY_PATH}/doing`;

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
    if (!alreadyInitted(DIRECTORY_PATH)) {
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
    onlyRunIfInitted(DIRECTORY_PATH, () => {
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
    onlyRunIfInitted(DIRECTORY_PATH, () => {
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

//this is to mock in behaviour till i learn how to test for NaN
const tempNotNaNTest = true;
program
  .command("advance <number>")
  .alias("a")
  .description(
    "advance an item from todo to doing, Usage: to-git advance [indicator number from to-do list]"
  )
  .action((number) =>
    onlyRunIfInitted(DIRECTORY_PATH, () => {
      indicatorInt = parseInt(number);
      if (tempNotNaNTest) {
        const todo_array = splitLinesToArraySync(TODO_PATH);
        if (todo_array.length > 0) {
          if (indicatorInt >= 0 && indicatorInt < todo_array.length) {
            const itemToMove = todo_array[indicatorInt];
            fs.appendFileSync(DOING_PATH, `${itemToMove}\n`);
            const new_todo_string = todo_array
              .filter((item) => item !== itemToMove)
              //to replace the blank newline on the end of the file
              .concat([""])
              .join("\n");
            fs.writeFileSync(TODO_PATH, new_todo_string, "utf8");
          } else {
            console.error(
              `Number '${indicatorInt}' does not indicate a current to-do list item. Please enter a number between 0 and ${
                todo_array.length - 1
              }`
            );
          }
        } else {
          console.error("There are currently no items in the to-do list.");
        }
      } else {
        console.error(
          `Non-integer argument: ${number}. Please enter an integer number indicating the to-do item you wish to advance to doing`
        );
      }
    })
  );

program.parse(process.argv);
