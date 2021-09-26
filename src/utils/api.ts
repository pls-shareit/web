/** Wrapper methods for the ShareIt API. */

type Method = "GET" | "POST" | "PATCH" | "DELETE";
type RequestOptions = {
  body?: Blob | string;
  password?: string | null;
  token?: string | null;
  headers?: Record<string, string>;
};

export type RawCustomNameSettings = {
  min_length: number;
  max_length: number;
};

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
  const res = await fetch(endpoint, { method, headers, body }).catch(() => {
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

async function decodeResponse(response: Response): Promise<string> {
  return await response.text().catch(() => {
    throw new Error("Could not decode server response.");
  });
}

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

type BaseShareCreateOptions = {
  name: string;
  data: Blob | string;
  password?: string | null;
  expiry?: number | null;
};

export type GenericShareCreateOptions = BaseShareCreateOptions & {
  shareType: "file" | "link" | "paste";
  otherHeaders?: Record<string, string>;
};

export type NewShare = {
  url: string;
  name: string;
  token: string | null;
};

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

export type FileCreateOptions = BaseShareCreateOptions & {
  mimeType?: string | null;
};

export async function createFileShare(
  options: FileCreateOptions,
): Promise<NewShare> {
  return createShare({
    ...options,
    shareType: "file",
    otherHeaders: options.mimeType ? { "Content-Type": options.mimeType } : {},
  });
}

export type LinkCreateOptions = BaseShareCreateOptions;

export async function createLinkShare(
  options: LinkCreateOptions,
): Promise<NewShare> {
  return createShare({ ...options, shareType: "link" });
}

export type PasteCreateOptions = BaseShareCreateOptions & {
  language?: string | null;
};

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
