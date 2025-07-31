const { execSync } = require("child_process")
const fs = require("fs")

const commitHash = execSync("git rev-parse HEAD").toString().trim()

const content = `export const GIT_COMMIT = '${commitHash}';\n`

fs.writeFileSync("commit.ts", content)

console.log("✅ commit.ts generated with hash:", commitHash)
