import { handleSafeIntentRequest } from "../../shared/src";

export const onRequest: PagesFunction = (context) => handleSafeIntentRequest(context.request);
