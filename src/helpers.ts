import * as os from "os";
export function getDownloadUrl(): string {
  switch (os.type()) {
    case "Linux":
      return "https://github.com/Inedo/upack/releases/download/3.1.1/upack-net6.0-linux-x64.zip";
    case "Windows_NT":
      return "https://github.com/Inedo/upack/releases/download/3.1.1/upack-net6.0-win-x64.zip";
    default:
      if (os.type().match(/^Win/)) {
        return "https://github.com/Inedo/upack/releases/download/3.1.1/upack-net6.0-win-x64.zip";
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