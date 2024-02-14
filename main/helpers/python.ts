import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "node:child_process";

import { BrowserWindow } from "electron";

import { getDirectory } from "./utils";

export async function python(
	arguments_: string[],
	{
		stdout,
		stderr,
		onProcessStarted,
	}: {
		stdout?(data: string): void;
		stderr?(data: string): void;
		onProcessStarted?(process: ChildProcessWithoutNullStreams): void;
	} = {}
) {
	const pathToEmbeddedPython = getDirectory("python-embedded", "python.exe");
	const window_ = BrowserWindow.getFocusedWindow();

	return new Promise((resolve, reject) => {
		if (!window_) {
			reject(new Error(`No window`));
			return;
		}

		const process = spawn(pathToEmbeddedPython, arguments_);

		process.stdout.on("data", data => {
			if (stdout) {
				stdout(data.toString());
			}
		});

		process.stderr.on("data", data => {
			if (stderr) {
				stderr(data.toString());
			}
		});

		process.on("close", code => {
			if (code === 0) {
				resolve(code);
			} else {
				reject(new Error(`Python script exited with code ${code}`));
			}
		});

		if (onProcessStarted) {
			onProcessStarted(process);
		}
	});
}
