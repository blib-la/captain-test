import { app } from "electron";

import { main } from "@/main";

// Import core setup module.
// This ensures the core setup process is executed explicitly, even though it may already be called
// by dependencies.
// The core setup is crucial for configuring the application environment before other modules are
// loaded.
import "@/core-setup";

// Deprecated IPC Modules
// Warning: The IPC handlers and listeners imported below are considered deprecated.
// They are included here for backward compatibility with older versions of the application or for
// specific legacy features.
// It's important to avoid using these for new development, as they may be removed in future
// releases.

// If your feature requires IPC communication, refer to the updated IPC modules and documentation
// for the recommended practices.
// Note: If migration to the new modules is not immediately feasible, ensure to document the usage
// of deprecated modules within your codebase to plan for future refactoring.

/**
 * @deprecated Handles legacy IPC event listeners
 * Consider migrating to the new event handling approach outlined in "@/ipc/sdk" or "@/ipc/global".
 */
import "@/ipc/listeners";

/**
 * @deprecated Manages IPC for outdated storytelling or narrative-driven interactions.
 * Consider migrating to the new event handling approach outlined in "@/ipc/sdk" or "@/ipc/global".
 */
import "@/ipc/story";

// Import modules for managing globally accessible functionalities.
// This includes window management tasks such as minimizing, maximizing, or closing windows.
import "@/ipc/global"; // Manages global IPC events, including those related to window actions.

// Import SDK module for 3rd party integration.
// This allows external applications to interact with the app through exposed handlers and
// listeners.
import "@/ipc/sdk";

// Import install handlers and listeners
import "@/ipc/install";

// Import testing helpers
import "@/ipc/testing";
import "@/ipc/vector-store";

// Initialize the application by calling the main function.
// Upon completion, log to the console indicating the application has started.
main().then(() => {
	console.log("Application started successfully.");
});

// Listen for the 'window-all-closed' event on the Electron app object.
// This event is emitted when all windows of the application have been closed.
// In response, quit the application to free up resources, adhering to typical desktop application
// behavior.
app.on("window-all-closed", () => {
	app.quit();
});
