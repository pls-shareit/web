/** This file defines the currently available themes. */

const THEME_VARIABLES = {
  // Background of the whole page. Also used as the colour for the button to
  // enable the theme, unless the displayColour method is overwritten.
  background: "--background",

  // A background for "item" elements - items can be any visually distinct
  // element.
  item_background: "--item-background",

  // A border for item elements.
  item_border: "--item-border",

  // A border for disabled item elements.
  disabled_item_border: "--disabled-item-border",

  // The width of the above border. Should always be set if the border is.
  item_border_width: "--item-border-width",

  // A background to show on item elements when hovered.
  item_hover_background: "--item-hover-background",

  // A colour for less important visual decorations.
  secondary_colour: "--secondary-colour",

  // A colour for all text on the page.
  text_colour: "--text-colour",

  // A colour for text labelling disabled elements.
  disabled_colour: "--disabled-colour",

  // A CSS filter to apply to icons, which may be used to change their
  // colour.
  icon_filter: "--icon-filter",

  // A CSS filter for less important icons, which may be used to change their
  // colour.
  secondary_icon_filter: "--secondary-icon-filter",

  // A width for borders between elements of lists.
  list_border_width: "--list-border-width",

  // A colour to be displayed over all elements except the modal when a modal
  // is shown.
  popup_overlay: "--popup-overlay",

  // A background for modals.
  popup_background: "--popup-background",

  // A border for modals.
  popup_border: "--popup-border",

  // Hover background for elements within modals, that have the same normal
  // background as the modal.
  popup_hover_background: "--popup-hover-background",
};

/** The base class for themes, which sets all variables to "initial". */
class Theme {
  variables: Map<string, string>;

  /** Create the variables map and initialise every variable. */
  constructor() {
    this.variables = new Map();
    for (const variable of Object.values(THEME_VARIABLES)) {
      this.set(variable, "initial");
    }
    // This has to be a length.
    this.set(THEME_VARIABLES.item_border_width, "0px");
  }

  /** Set a variable by name.
   *
   * @param {string} name - The name of the variable.
   * @param {string} value - The value of the variable.
   */
  set(name: string, value: string) {
    this.variables.set(name, value);
  }

  /** Apply this theme to the document. */
  apply() {
    for (const [name, value] of this.variables) {
      document.documentElement.style.setProperty(name, value);
    }
  }

  /** Get the colour that should represent this theme to the user. */
  displayColour(): string {
    return this.variables.get(THEME_VARIABLES.background) || "white";
  }
}

/** A base class for "glass" style themes. */
class BaseGlassTheme extends Theme {
  /** Override the relevant variables for the glass theme.
   *
   * Does not set the background variable, this should be set by subclasses.
   */
  constructor() {
    super();
    const V = THEME_VARIABLES;
    this.set(V.secondary_colour, "#fff4");
    this.set(V.text_colour, "#fffc");
    this.set(V.disabled_colour, "#fff4");
    this.set(V.icon_filter, "invert(100%) opacity(80%)");
    this.set(V.secondary_icon_filter, "invert(100%) opacity(40%)");
    this.set(V.list_border_width, "1px");
    this.set(V.popup_overlay, "#0008");
    this.set(V.popup_hover_background, "#fff2");
  }
}

/** A red variant of the glass theme. */
class RedGlassTheme extends BaseGlassTheme {
  /** Set the background to red. */
  constructor() {
    super();
    this.set(THEME_VARIABLES.background, "#b83450");
    this.set(THEME_VARIABLES.popup_background, "#b83450");
    this.set(THEME_VARIABLES.item_background, "#c14f67");
    this.set(THEME_VARIABLES.item_hover_background, "#c9667b");
  }
}

/** A dark grey variant of the glass theme. */
class DarkGlassTheme extends BaseGlassTheme {
  /** Set the background to dark grey. */
  constructor() {
    super();
    this.set(THEME_VARIABLES.background, "#222");
    this.set(THEME_VARIABLES.popup_background, "#222");
    this.set(THEME_VARIABLES.item_background, "#3f3f3f");
    this.set(THEME_VARIABLES.item_hover_background, "#595959");
  }
}

/** A plain black and white theme with heavy borders. */
class PlainTheme extends Theme {
  /** Set the relevant variables. */
  constructor() {
    super();
    const V = THEME_VARIABLES;
    this.set(V.background, "#fff");
    this.set(V.item_background, "#fff");
    this.set(V.item_border, "2px solid #000");
    this.set(V.disabled_item_border, "2px solid #888");
    this.set(V.item_border_width, "2px");
    this.set(V.item_hover_background, "#fff");
    this.set(V.secondary_colour, "#000");
    this.set(V.text_colour, "#000");
    this.set(V.disabled_colour, "#888");
    this.set(V.list_border_width, "2px");
    this.set(V.popup_background, "#fff");
    this.set(V.popup_border, "2px solid #000");
    this.set(V.popup_overlay, "#0002");
  }
}

const COLOUR_THEMES = new Map<string, Theme>([
  ["red", new RedGlassTheme()],
  ["dark", new DarkGlassTheme()],
  ["plain", new PlainTheme()],
]);

/** Stores, updates and applies themes. */
export class ThemeManager {
  /** Make sure the theme is set on page load. */
  constructor() {
    this.updateTheme();
  }

  /** Update the theme to the current one. */
  updateTheme(): void {
    const theme = this.getCurrentTheme();
    theme.apply();
  }

  /** Get the current theme.
   *
   * @returns {Theme} The current theme.
   */
  getCurrentTheme(): Theme {
    const theme = localStorage.getItem("theme");
    if (theme && COLOUR_THEMES.has(theme)) {
      return <Theme>COLOUR_THEMES.get(theme);
    } else {
      return new RedGlassTheme();
    }
  }

  /** Set the current theme.
   *
   * @param {string} theme - The name of the theme to set.
   */
  setCurrentTheme(theme: string): void {
    if (COLOUR_THEMES.has(theme)) {
      localStorage.setItem("theme", theme);
      this.updateTheme();
    }
  }

  /** Get the name and representative colour of each theme.
   *
   * @returns {[string, string][]} The name and colour of each theme.
   */
  getThemeNames(): [string, string][] {
    return Array.from(COLOUR_THEMES.entries()).map(([name, theme]) => {
      return [name, theme.displayColour()];
    });
  }
}
