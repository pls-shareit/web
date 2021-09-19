/** An object representing the expiry of a share.
 *
 * This stores it in the way that the user specified it - either absolute,
 * relative or never - so that it can be converted to API format as accurately
 * as possible when the share is created.
 */
export interface Expiry {
  getSeconds(): number | null;
}

export class AbsoluteExpiry implements Expiry {
  constructor(private expiry: Date) {}

  getSeconds(): number {
    return this.expiry.getTime() - new Date().getTime();
  }
}

export class RelativeExpiry implements Expiry {
  constructor(private seconds: number) {}

  getSeconds(): number {
    return this.seconds;
  }
}

export class NoExpiry implements Expiry {
  getSeconds(): null {
    return null;
  }
}
