/** All the possible Vuex mutations and actions. */

// --- Mutations

/** Open the password picker (no args). */
export const OPEN_PASSWORD_PICKER = "openPasswordPicker";

/** Close the password picker (no args). */
export const CLOSE_PASSWORD_PICKER = "closePasswordPicker";

/** Set the user's password (arg is the password). */
export const SET_PASSWORD = "setPassword";

/** Store retrieved abilities (arg is a RawAbilities object). */
export const LOAD_ABILITIES = "loadAbilities";

/** Display a new error (arg contains "title" and "message" strings). */
export const NEW_ERROR = "newError";

/** Dismiss an error (arg is the error object). */
export const DISMISS_ERROR = "dismissError";

// --- Actions

/** Retrieve and store the latest abilities (no args). */
export const UPDATE_ABILITIES = "updateAbilities";
