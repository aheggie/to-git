#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");

const program = new Command();

program.version("0.0.1");

program
  .command("init")
  .alias("i")
  .description("initialise to-git on a project (call at the root of a repo)")
  .action(() => console.log("init"));

program.parse(process.argv);
