export interface GuinessCompatibleSpy extends jasmine.Spy {
  /** By chaining the spy with and.returnValue, all calls to the function will return a specific
   * value. */
  andReturn(val: any): GuinessCompatibleSpy;
  /** By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied
   * function. */
  andCallFake(fn: Function): GuinessCompatibleSpy;
  /** removes all recorded calls */
  reset(): void;
}

export class SpyObject {
  static stub(object: any = null, config: any = null, overrides: any = null): any {
    if (!(object instanceof SpyObject)) {
      overrides = config;
      config = object;
      object = new SpyObject();
    }

    const m = {};
    Object.keys(config).forEach(key => (m[key] = config[key]));
    Object.keys(overrides).forEach(key => (m[key] = overrides[key]));
    Object.keys(m).forEach(key => {
      object.spy(key).andReturn(m[key]);
    });
    return object;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(type: any = null) {
    if (type) {
      Object.keys(type.prototype).forEach(prop => {
        let m = null;
        try {
          m = type.prototype[prop];
        } catch (e) {
          // As we are creating spys for abstract classes,
          // these classes might have getters that throw when they are accessed.
          // As we are only auto creating spys for methods, this
          // should not matter.
        }
        if (typeof m === 'function') {
          this.spy(prop);
        }
      });
    }
  }

  spy(name: string): GuinessCompatibleSpy {
    if (!this[name]) {
      this[name] = this._createGuinnessCompatibleSpy(name);
    }
    return this[name];
  }

  /** @internal */
  _createGuinnessCompatibleSpy(name: string): GuinessCompatibleSpy {
    const newSpy: GuinessCompatibleSpy = jasmine.createSpy(name) as any;
    newSpy.andCallFake = newSpy.and.callFake as any;
    newSpy.andReturn = newSpy.and.returnValue as any;
    newSpy.reset = newSpy.calls.reset as any;
    // revisit return null here (previously needed for rtts_assert).
    newSpy.and.returnValue(null);
    return newSpy;
  }
}
