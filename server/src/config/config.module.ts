import ConfigService from "./config.service";

class ConfigModule {
    configService!: ConfigService;
    constructor() {
      this.configService = new ConfigService();
    }
}

export default ConfigModule;