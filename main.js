const {
  exec,
  spawn
} = require("child_process");
const SCRIPT_FILE = "botify.js";
const SCRIPT_PATH = __dirname + "/" + SCRIPT_FILE;
const GIT = process.env.git;

async function Load() {
  console.log(`Auto pull`);
  const execute = async (cmd) => {
    await new Promise(async (resolve, reject) => {
      const buang = await exec(cmd, {
          cwd: __dirname,
          stdio: "inherit",
          shell: true
        },
        (async (error, stdout, stderr) => {
          if (error) console.error(error);
          if (stdout) console.log(stdout);
          if (stderr) console.error(stderr);
          resolve();
        }));
    });
  };
  const execute1 = async (cmd, args) => {
    await new Promise((resolve, reject) => {
      let main_ = spawn(cmd, args, {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
      });
      main_.on("data", data => console.log(data));
      main_.on("close", async (exitCode) => {
        if (exitCode === 0) console.log(`Success: code ${exitCode}`);
        else if (exitCode === 1) {
          console.log(`Error: code ${exitCode}`);
          console.log(`Restarting...`);
          Load();
        } else console.log(`Error: code ${exitCode}`);
        resolve();
        return;
      });
    });
  };
  await execute(`rm -rf /.git`);
  await execute1(`git pull`, [GIT, "main", ""]);
  console.log("Done!");
  await execute1("npm", ["install"]);
  await execute1(`node`, [SCRIPT_PATH]);
  return;
}
Load();
process.on("unhandledRejection", reason => console.log(reason));