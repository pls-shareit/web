/** Wrapper methods for the ShareIt API. */

type OkResultHandler<T, A> = (value: T) => A;
type ErrResultHandler<E, A> = (error: E) => A;

export interface Result<T, E> {
  isError: boolean;
  isOk: boolean;

  /** Raise the error or return the value. */
  unwrap(): T;

  /** Call a function with the value, if successful.
   *
   * Returns the original result for chaining.
   *
   * Example:
   *
   * ```js
   * result
   *   .onOk(value => console.log(value))
   *   .onError(value => console.error(value));
   * ```
   */
  onOk<A>(f: (value: T) => A): this;

  /** Call a function with the error, if any.
   *
   * Returns the original result for chaining. See also `onOk`.
   */
  onError<A>(f: (error: E) => A): this;

  /** If successful, replace the value with another.
   *
   * Example:
   *
   * ```js
   * const result: Result<int, string> = doSomeCalculation();
   * const stringResult: Result<string, string> = result.map(number => number.toString());
   * ```
   */
  map<NT>(f: (value: T) => NT): Result<NT, E>;

  /** Replace the error with another, if any. */
  mapErr<NE>(f: (error: E) => NE): Result<T, NE>;
}

/** The result variant for a success. */
export class OkResult<T> implements Result<T, never> {
  public isError = false;
  public isOk = true;

  constructor(public value: T) {}

  unwrap(): T {
    return this.value;
  }

  onOk<A>(f: OkResultHandler<T, A>): this {
    f(this.value);
    return this;
  }

  onError<A>(_f: ErrResultHandler<never, A>): this {
    return this;
  }

  map<NT>(f: OkResultHandler<T, NT>): OkResult<NT> {
    return new OkResult(f(this.value));
  }

  mapErr<NE>(_f: ErrResultHandler<never, NE>): this {
    return this;
  }
}

export class ErrResult<E> implements Result<never, E> {
  public isError = true;
  public isOk = false;

  constructor(public error: E) {}

  unwrap(): never {
    throw new Error("" + this.error);
  }

  onOk<A>(_f: OkResultHandler<never, A>): this {
    return this;
  }

  onError<A>(f: ErrResultHandler<E, A>): this {
    f(this.error);
    return this;
  }

  map<NT>(_f: OkResultHandler<never, NT>): this {
    return this;
  }

  mapErr<NE>(f: ErrResultHandler<E, NE>): ErrResult<NE> {
    return new ErrResult(f(this.error));
  }
}

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
): Promise<Result<string, string>> {
  headers = headers || {};
  if (password) {
    headers["Authorization"] = `Password ${password}`;
  } else if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  const res = await fetch(endpoint, {
    method,
    headers,
    body,
  });
  const content = await res.text();
  if (res.status >= 400) {
    return new ErrResult(content);
  } else {
    return new OkResult(content);
  }
}

export async function getAbilities(
  password: string | null = "",
): Promise<Result<RawAbilities, string>> {
  const res = await request("GET", "/meta/abilities", { password });
  return res.map(JSON.parse);
}
