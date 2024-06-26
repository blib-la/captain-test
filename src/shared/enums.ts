/**
 * Enum `KEY` serves as a centralized registry of key identifiers used across different Electron stores.
 * This approach ensures consistency in naming conventions and simplifies the management of various data segments
 * within the application. Each member of the enum represents a distinct data domain or functionality,
 * facilitating a modular and organized storage strategy.
 */
export enum KEY {
	APP = "APP",
	DOWNLOADS = "DOWNLOADS",
	INVENTORY = "INVENTORY",
	KEYS = "KEYS",
	MARKETPLACE = "MARKETPLACE",
	STORE = "STORE",
	USER = "USER",
	WINDOW = "WINDOW",
}

/**
 * Enum `ID` serves as a centralized registry of key identifiers used across different Electron stores.
 * This approach ensures consistency in naming conventions and simplifies the management of various data segments
 * within the application. Each member of the enum represents a distinct data domain or functionality,
 * facilitating a modular and organized storage strategy.
 */
export enum ID {
	APP = "APP",
	CAPTAIN = "CAPTAIN",
	CAPTAIN_ACTION = "CAPTAIN_ACTION",
	DIRECTORY = "DIRECTORY",
	DOWNLOADS = "DOWNLOADS",
	FILE = "FILE",
	IMAGE = "IMAGE",
	INSTALL = "INSTALL",
	INVENTORY = "INVENTORY",
	KEYS = "KEYS",
	MARKETPLACE = "MARKETPLACE",
	PROMPT = "PROMPT",
	STORE = "STORE",
	VECTOR_STORE = "VECTOR_STORE",
	USER = "USER",
	WINDOW = "WINDOW",
	LIVE_PAINT = "LIVE_PAINT",
	STORY = "STORY",
}

/**
 * Enum representing the possible states of a download process.
 */
export enum DownloadState {
	/**
	 * The download is currently idle.
	 */
	IDLE = "IDLE",

	/**
	 * The download is currently in progress.
	 */
	ACTIVE = "ACTIVE",

	/**
	 * The download has completed successfully.
	 */
	DONE = "DONE",

	/**
	 * The download has encountered an error and did not complete.
	 */
	FAILED = "FAILED",

	/**
	 * The download has been canceled by rhe user and did not complete.
	 */
	CANCELED = "CANCELED",

	/**
	 * The download is being unpacked.
	 */
	UNPACKING = "UNPACKING",
}
