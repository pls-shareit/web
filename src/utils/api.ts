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
): Promise<string> {
  headers = headers || {};
  if (password) {
    headers["Authorization"] = `Password ${password}`;
  } else if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  return new Promise((resolve, reject) => {
    fetch(endpoint, { method, headers, body }).then(
      (res) =>
        res.text().then(
          (content) => (res.ok ? resolve(content) : reject(content)),
          () => reject("Could not decode server response."),
        ),
      () => reject("HTTP connection to server failed."),
    );
  });
}

export async function getAbilities(
  password: string | null = "",
): Promise<RawAbilities> {
  return request("GET", "/meta/abilities", { password }).then((content) => {
    try {
      return JSON.parse(content);
    } catch (e) {
      throw "Could not parse server response.";
    }
  });
}
