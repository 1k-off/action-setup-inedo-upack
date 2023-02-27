import * as path from "path";
import * as core from "@actions/core";
import * as toolCache from "@actions/tool-cache";
import * as util from "util";
import {
  getDownloadUrl,
  getExecutableExtension,
  getlatestVersion,
} from "./helpers";
import * as fs from "fs";

let upackToolName = "upack";

export async function run() {
  let token = core.getInput("github_token", { required: true });
  let version = await getlatestVersion(token);

  const cachedPath = await downloadUpack(version, token);

  core.addPath(path.dirname(cachedPath));

  core.debug(
    `Upack tool version: '${version}' has been cached at ${cachedPath}`
  );
  core.setOutput("upack-path", cachedPath);
}

export async function downloadUpack(
  version: string,
  token: string
): Promise<string> {
  let downloadPath = "";
  let extractPath = "";

  let cachedToolpath = toolCache.find(upackToolName, version);

  if (!cachedToolpath) {
    try {
      let url = await getDownloadUrl(version);
      core.debug(
        `Download URL: ${url}`
      );
      downloadPath = await toolCache.downloadTool(url);
      core.debug(
        `Download path: ${downloadPath}`
      );
      extractPath = await toolCache.extractZip(downloadPath);
      core.debug(
        `Extract path: ${extractPath}`
      );
    } catch (exception) {
      if (
        exception instanceof toolCache.HTTPError &&
        exception.httpStatusCode === 404
      ) {
        throw new Error(
          util.format("Upack not found for version '%s'.", version)
        );
      }
    }
    if (extractPath === "") {
      throw new Error("Failed to extract upack");
    }

    cachedToolpath = await toolCache.cacheFile(
      path.join(extractPath, upackToolName + getExecutableExtension()),
      upackToolName + getExecutableExtension(),
      upackToolName,
      version
    );
  }
  const upackPath = path.join(
    cachedToolpath,
    upackToolName + getExecutableExtension()
  );
  fs.chmodSync(upackPath, "775");
  return upackPath;
}

run().catch(core.setFailed);
