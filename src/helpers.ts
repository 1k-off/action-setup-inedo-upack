import * as os from "os";
import * as github from "@actions/github";
export async function getDownloadUrl(token: string): Promise<string> {
  const octokit = github.getOctokit(token)
  let version = await octokit.request('GET /repos/Inedo/upack/releases/latest', {
    owner: 'Inedo',
    repo: 'upack',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  switch (os.type()) {
    case "Linux":
      return `https://github.com/Inedo/upack/releases/download/${version}/upack-net6.0-linux-x64.zip`;
    case "Windows_NT":
      return `https://github.com/Inedo/upack/releases/download/${version}/upack-net6.0-win-x64.zip`;
    default:
      if (os.type().match(/^Win/)) {
        return `https://github.com/Inedo/upack/releases/download/${version}/upack-net6.0-win-x64.zip`;
      } else {
        return "Unsupported OS ${os.type()}";
      }
  }
}

export function getExecutableExtension(): string {
  if (os.type().match(/^Win/)) {
    return ".exe";
  }
  return "";
}