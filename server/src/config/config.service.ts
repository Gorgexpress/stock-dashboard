class ConfigService {
  constructor() {}
  get(key: string): string {
    const value = process.env[key];
    if (value === undefined)
      throw new Error(`Tried to access nonexistent environmental variable: ${key}`)
    return process.env[key] as string;
  }
  set(key: string, value: string) {
    process.env[key] = value;
  }

}

export default ConfigService;