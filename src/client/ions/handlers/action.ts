import type { VectorStoreResponse } from "@captn/utils/types";

import { buildKey } from "#/build-key";
import { ID } from "#/enums";

/**
 * Processes an action based on the provided vector store response. The function distinguishes between
 * "function" actions, which trigger specific functionalities, and other types of actions, such as opening an app.
 * If the action is of type "function", it sends a message via the `window.ipc.send` method with a key built
 * from the `CAPTAIN_ACTION` ID and includes the entire payload in the message.
 *
 * For other types of actions, it constructs a key using the `APP` ID with an optional ":open" suffix
 * and sends a message with the `appId` and action type, derived from the response payload. If the `query` parameter
 * is provided, it is converted to a query string and appended to the URL when the corresponding app is opened.
 *
 * This allows for dynamic handling of actions within the application, facilitating communication
 * with different parts of the system or triggering specific operations based on the vector store response.
 *
 * @param {VectorStoreResponse} response - The response object from the vector store, containing the payload
 * with details about the action to be performed.
 * @param {Record<string, string>} [query] - Optional query parameters as an object, which, if provided,
 * will be converted into a query string and appended to the URL when opening an app.
 */
export function handleCaptainAction(response: VectorStoreResponse, query?: Record<string, string>) {
	if (response.payload.action === "function") {
		window.ipc.send(buildKey([ID.CAPTAIN_ACTION]), {
			action: response.payload.action,
			payload: response.payload,
		});
	} else {
		window.ipc.send(buildKey([ID.APP], { suffix: ":open" }), {
			appId: response.payload.id,
			action: response.payload.action,
			options: response.payload.parameters,
			query,
		});
	}
}
