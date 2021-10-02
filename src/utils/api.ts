/** Wrapper methods for the ShareIt API. */

/** An HTTP method used within the API. */
type Method = "GET" | "POST" | "PATCH" | "DELETE";

/** Options for generic requests to the API. */
type RequestOptions = {
  body?: Blob | string;
  password?: string | null;
  token?: string | null;
  headers?: Record<string, string>;
};

/** Make a request to one of the API endpoints.
 *
 * The `password` and `token` parameters are mutually exclusive.
 *
 * Errors if there is a network issue while making the request, or if the
 * server responds with an error. Throws an instance of `Error` with a
 * descriptive message.
 */
async function request(
  method: Method,
  endpoint: string,
  {
    body = undefined,
    password = null,
    token = null,
    headers = {},
  }: RequestOptions = {},
): Promise<Response> {
  headers = headers || {};
  if (password) {
    headers["Authorization"] = `Password ${password}`;
  } else if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  headers["Accept-Redirect"] = "no"; // We never want real redirects.
  const res = await fetch(endpoint, {
    method,
    headers,
    body,
  }).catch(() => {
    throw new Error("Could not connect to server.");
  });
  if (res.ok) return res;
  const text = await decodeResponse(res).catch(() => {
    throw new Error(
      `Server gave ${res.status} error with undecodable message.`,
    );
  });
  throw new Error(text);
}

/** Utility function to decode an API response as text.
 *
 * Throws an instance of `Error` if the response is not a valid UTF-8 string.
 */
async function decodeResponse(response: Response): Promise<string> {
  return await response.text().catch(() => {
    throw new Error("Could not decode server response.");
  });
}

/** Restrictions on custom names, as returned by the API. */
export type RawCustomNameSettings = {
  min_length: number;
  max_length: number;
};

/** What the authenticated user is able to do, as returned by the API. */
export type RawAbilities = {
  login: boolean;
  create_file: boolean;
  create_link: boolean;
  create_paste: boolean;
  update_own: boolean;
  update_any: boolean;
  custom_names: RawCustomNameSettings | null;
  max_expiry_time: number | null;
  mime_types_white_list: string[];
  mime_types_black_list: string[];
  link_schemes: string[];
  highlighting_languages: string[];
};

/** A reasonable default placeholder for a RawAbilities instance. */
export const EMPTY_ABILITIES: RawAbilities = {
  login: true,
  create_file: false,
  create_link: false,
  create_paste: false,
  update_own: false,
  update_any: false,
  custom_names: null,
  max_expiry_time: null,
  mime_types_white_list: [],
  mime_types_black_list: [],
  link_schemes: [],
  highlighting_languages: [],
};

/** Get information on what the authenticated user is able to do.
 *
 * If no password is given, gives information on what the user can do without
 * a password.
 *
 * Throws an instance of `Error` if the server responds with an error, there is
 * a network issue, or if the response could not be decoded and parsed.
 */
export async function getAbilities(
  password: string | null = "",
): Promise<RawAbilities> {
  const res = await request("GET", "/meta/abilities", { password });
  const raw = await decodeResponse(res);
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Could not parse server response as JSON.");
  }
}

/** Properties common to all share creation options. */
type BaseShareCreateOptions = {
  name: string;
  data: Blob | string;
  password?: string | null;
  expiry?: number | null;
};

/** Options for creating a new share of any type. */
export type GenericShareCreateOptions = BaseShareCreateOptions & {
  shareType: "file" | "link" | "paste";
  otherHeaders?: Record<string, string>;
};

/** Information on a newly created share. */
export type NewShare = {
  url: string;
  name: string;
  token: string | null;
};

/** Create a new share of any type.
 *
 * Throws an instance of `Error` if the server responds with an error, there is
 * a network issue, or if the response could not be decoded and parsed.
 */
export async function createShare({
  name,
  shareType,
  data,
  password = null,
  expiry = null,
  otherHeaders = {},
}: GenericShareCreateOptions): Promise<NewShare> {
  otherHeaders["Share-Type"] = shareType;
  if (expiry !== null) otherHeaders["Expire-After"] = expiry.toString();
  const endpoint = name ? `/${name}` : "/";
  const res = await request("POST", endpoint, {
    password,
    body: data,
    headers: otherHeaders,
  });
  const raw = await decodeResponse(res);
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Could not parse server response as a URL.");
  }
  const createdName = url.pathname.slice(1);
  const token = res.headers.get("Share-Token");
  return { url: raw, name: createdName, token: token };
}

/** Options for creating a file share. */
export type FileCreateOptions = BaseShareCreateOptions & {
  mimeType?: string | null;
};

/** Create a new file share.
 *
 * Throws an instance of `Error` if the server responds with an error, there is
 * a network issue, or if the response could not be decoded and parsed.
 */
export async function createFileShare(
  options: FileCreateOptions,
): Promise<NewShare> {
  return createShare({
    ...options,
    shareType: "file",
    otherHeaders: options.mimeType ? { "Content-Type": options.mimeType } : {},
  });
}

/** Options for creating a link share. */
export type LinkCreateOptions = BaseShareCreateOptions;

/** Create a new link share.
 *
 * Throws an instance of `Error` if the server responds with an error, there is
 * a network issue, or if the response could not be decoded and parsed.
 */
export async function createLinkShare(
  options: LinkCreateOptions,
): Promise<NewShare> {
  return createShare({ ...options, shareType: "link" });
}

/** Options for creating a paste share. */
export type PasteCreateOptions = BaseShareCreateOptions & {
  language?: string | null;
};

/** Create a new paste share.
 *
 * Throws an instance of `Error` if the server responds with an error, there is
 * a network issue, or if the response could not be decoded and parsed.
 */
export async function createPasteShare(
  options: PasteCreateOptions,
): Promise<NewShare> {
  return createShare({
    ...options,
    shareType: "paste",
    otherHeaders: options.language
      ? { "Share-Highlighting": options.language }
      : {},
  });
}

/** Properties common to all share types. */
type BaseShare = { url: string; name: string };

/** Metadata and file content for a file share. */
export type FileShare = BaseShare & {
  type: "file";
  file: Blob;
  contentType: string;
};

/** Metadata and full link for a link share. */
export type LinkShare = BaseShare & { type: "link"; link: string };

/** Metadata and paste content for a paste share. */
export type PasteShare = BaseShare & {
  type: "paste";
  paste: string;
  language: string;
};

/** Metadata and content for a share of any type. */
export type Share = FileShare | LinkShare | PasteShare;

/** Retrieve metadata and content for a share.
 *
 * Throws an instance of `Error` if the server responds with an error, there is
 * a network issue, or if the response could not be decoded.
 */
export async function getShare(name: string): Promise<Share> {
  const res = await request("GET", `/${name}`);
  const type = res.headers.get("Share-Type")?.toLowerCase();
  if (!type) throw new Error("Share type header was not set.");
  const share = { url: `${window.location.origin}/${name}`, name };
  switch (type) {
    case "file": {
      const file = await res.blob();
      const contentType =
        res.headers.get("Content-Type") || "application/octet-stream";
      return { ...share, type: "file", file, contentType };
    }
    case "link": {
      const link = res.headers.get("Location");
      if (!link) throw new Error("Link header was not set.");
      return { ...share, type: "link", link };
    }
    case "paste": {
      const paste = await decodeResponse(res);
      const language = res.headers.get("Share-Highlighting") || "auto";
      return { ...share, type: "paste", paste, language };
    }
    default:
      throw new Error(`Share type ${type} is not recognised.`);
  }
}
