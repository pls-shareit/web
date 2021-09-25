/** Vuex data store. */
import { createStore } from "vuex";
import {
  getAbilities,
  RawCustomNameSettings,
  RawAbilities,
  EMPTY_ABILITIES,
} from "@/utils/api";
import * as names from "@/utils/mutations";

class CustomNameSettings {
  public minLength: number;
  public maxLength: number;

  constructor({ min_length, max_length }: RawCustomNameSettings) {
    this.minLength = min_length;
    this.maxLength = max_length;
  }
}

export class Actions {
  public login: boolean;
  public createFile: boolean;
  public createLink: boolean;
  public createPaste: boolean;
  public updateOwn: boolean;
  public updateAny: boolean;
  public customNames: CustomNameSettings | null;

  constructor({
    login,
    create_file,
    create_link,
    create_paste,
    update_own,
    update_any,
    custom_names,
  }: RawAbilities) {
    this.login = login;
    this.createFile = create_file;
    this.createLink = create_link;
    this.createPaste = create_paste;
    this.updateOwn = update_own;
    this.updateAny = update_any;
    this.customNames = custom_names
      ? new CustomNameSettings(custom_names)
      : null;
  }
}

export class ShareRestrictions {
  mimeTypesWhiteList: string[];
  mimeTypesBlacklist: string[];
  linkSchemes: string[];
  public highlightingLanguages: string[];
  public defaultHighlightingLanguage: string;
  public maxExpiryTime: number | null;

  constructor({
    mime_types_white_list,
    mime_types_black_list,
    link_schemes,
    highlighting_languages,
    max_expiry_time,
  }: RawAbilities) {
    this.mimeTypesWhiteList = mime_types_white_list;
    this.mimeTypesBlacklist = mime_types_black_list;
    this.linkSchemes = link_schemes;
    this.highlightingLanguages = highlighting_languages;
    if (this.highlightingLanguageAllowed("auto")) {
      this.defaultHighlightingLanguage = "auto";
    } else {
      // If the array is empty, any language is allowed. So if auto is
      // not allowed, there must be at least one element in the list.
      this.defaultHighlightingLanguage = this.highlightingLanguages[0];
    }
    this.maxExpiryTime = max_expiry_time;
  }

  highlightingLanguageAllowed(language: string): boolean {
    return (
      this.highlightingLanguages.length === 0 ||
      this.highlightingLanguages.includes(language)
    );
  }

  mimeTypeAllowed(mimeType: string): boolean {
    if (this.mimeTypesWhiteList.length === 0) {
      return !this.mimeTypesBlacklist.includes(mimeType);
    }
    return this.mimeTypesWhiteList.includes(mimeType);
  }

  linkAllowed(
    link: string,
  ): { allowed: true } | { allowed: false; reason: string } {
    let url;
    try {
      url = new URL(link);
    } catch (error) {
      if (
        error instanceof TypeError &&
        ("" + error).includes("not a valid URL")
      ) {
        return {
          allowed: false,
          reason: "URL invalid - maybe start with 'https://'?.",
        };
      }
      throw error;
    }
    // Get the protocol of the link and remove the trailing colon.
    const scheme = url.protocol.slice(0, -1);
    if (this.linkSchemes.length === 0 || this.linkSchemes.includes(scheme)) {
      return { allowed: true };
    }
    const schemes =
      this.linkSchemes.length < 2
        ? this.linkSchemes[0]
        : this.linkSchemes.slice(0, -1).join(", ") +
          " or " +
          this.linkSchemes.slice(-1);
    return { allowed: false, reason: `Must start with ${schemes}.` };
  }
}

export type ErrorMessage = {
  title: string;
  message: string;
  timestamp: Date;
};

type ScreenName = "title" | "link" | "paste" | "file";

export type State = {
  screen: ScreenName;
  passwordPickerOpen: boolean;
  password: string | null;
  actions: Actions;
  restrictions: ShareRestrictions;
  errors: ErrorMessage[];
};

export const store = createStore({
  state(): State {
    return {
      screen: "title",
      passwordPickerOpen: false,
      password: localStorage.getItem("shareit-password") || null,
      actions: new Actions(EMPTY_ABILITIES),
      restrictions: new ShareRestrictions(EMPTY_ABILITIES),
      errors: [],
    };
  },
  mutations: {
    [names.SWITCH_SCREEN](state: State, screen: ScreenName) {
      state.screen = screen;
    },
    [names.OPEN_PASSWORD_PICKER](state: State) {
      state.passwordPickerOpen = true;
    },
    [names.CLOSE_PASSWORD_PICKER](state: State) {
      state.passwordPickerOpen = false;
    },
    [names.SET_PASSWORD](state: State, password: string) {
      localStorage.setItem("shareit-password", password);
      state.password = password;
    },
    [names.LOAD_ABILITIES](state: State, abilities: RawAbilities) {
      state.actions = new Actions(abilities);
      state.restrictions = new ShareRestrictions(abilities);
    },
    [names.NEW_ERROR](
      state: State,
      { title, message }: { title: string; message: string },
    ) {
      state.errors.push({
        title: title,
        message: message,
        timestamp: new Date(),
      });
    },
    [names.DISMISS_ERROR](state: State, error: ErrorMessage) {
      const idx = state.errors.indexOf(error);
      if (idx > -1) state.errors.splice(idx, 1);
    },
  },
  actions: {
    [names.UPDATE_ABILITIES](context) {
      getAbilities(context.state.password)
        .then((abilities) => context.commit(names.LOAD_ABILITIES, abilities))
        .catch((error) => {
          context.commit(names.LOAD_ABILITIES, EMPTY_ABILITIES);
          if (context.state.password !== "") {
            context.commit(names.SET_PASSWORD, "");
            context.dispatch(names.UPDATE_ABILITIES);
            error += " Retrying without password.";
          }
          context.commit(names.NEW_ERROR, {
            title: "Error connecting",
            message: error,
          });
        });
    },
  },
});
