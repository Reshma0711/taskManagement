
const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const inputFile = path.resolve("src/swagger-output.json");
const outputFile = path.resolve(
  "src/swagger/generated.swagger.ts"
);

const supportedMethods = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
];

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

// 1. Check input file
if (!fs.existsSync(inputFile)) {
  fail(
    `Input file not found: ${inputFile}\n` +
    "Generate swagger-output.json first."
  );
}

// 2. Read JSON
let swagger;

try {
  swagger = JSON.parse(
    fs.readFileSync(inputFile, "utf8")
  );
} catch (error) {
  fail(`Invalid JSON: ${error.message}`);
}

// 3. Validate basic OpenAPI structure
if (
  !swagger ||
  typeof swagger !== "object" ||
  !swagger.paths ||
  typeof swagger.paths !== "object"
) {
  fail(
    "Invalid Swagger document: 'paths' object is missing."
  );
}

if (
  !swagger.openapi &&
  !swagger.swagger
) {
  fail(
    "Missing OpenAPI/Swagger version field."
  );
}

// 4. Validate OpenAPI 3.x requestBody compatibility
if (
  swagger.openapi &&
  !swagger.openapi.startsWith("3.")
) {
  fail(
    `Unsupported OpenAPI version: ${swagger.openapi}`
  );
}

// 5. Convert each path operation into an @openapi comment
const comments = [];
let operationCount = 0;

for (const [route, pathItem] of Object.entries(
  swagger.paths
)) {
  if (
    !pathItem ||
    typeof pathItem !== "object" ||
    Array.isArray(pathItem)
  ) {
    console.warn(`⚠️ Skipping invalid path: ${route}`);
    continue;
  }

  for (const method of supportedMethods) {
    const operation = pathItem[method];

    if (
      !operation ||
      typeof operation !== "object" ||
      Array.isArray(operation)
    ) {
      continue;
    }

    // Keep the complete operation, including:
    // parameters, requestBody, responses, security,
    // schemas references and other OpenAPI properties.
    const operationDocument = {
      [route]: {
        [method]: operation,
      },
    };

    let yamlText;

    try {
      yamlText = YAML.stringify(operationDocument, {
        lineWidth: 0,
      }).trimEnd();
    } catch (error) {
      fail(
        `Could not serialize ${method.toUpperCase()} ${route}: ` +
        error.message
      );
    }

    // Escape any sequence that could terminate a block comment.
    const safeYaml = yamlText
      .split("\n")
      .map((line) => ` * ${line}`)
      .join("\n")
      .replace(/\*\//g, "*\\/");

    comments.push(
      `/**\n * @openapi\n${safeYaml}\n */`
    );

    operationCount++;
  }
}

// 6. Generate the TypeScript file
const generatedContent = [
  "/**",
  " * AUTO-GENERATED FILE.",
  " * Do not edit manually.",
  " * Regenerate using the OpenAPI comment generator.",
  " */",
  "",
  ...comments.flatMap((comment) => [comment, ""]),
  "export {};",
  "",
].join("\n");

fs.mkdirSync(path.dirname(outputFile), {
  recursive: true,
});

fs.writeFileSync(
  outputFile,
  generatedContent,
  "utf8"
);

console.log("\n✅ OpenAPI comments generated successfully.");
console.log(`📄 Input:  ${inputFile}`);
console.log(`📄 Output: ${outputFile}`);
console.log(`🔢 Operations generated: ${operationCount}`);

if (operationCount === 0) {
  console.warn(
    "⚠️ No operations found. Check the paths in your input JSON."
  );
}