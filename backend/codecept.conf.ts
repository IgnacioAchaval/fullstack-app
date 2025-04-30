import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
import { RESTConfig } from 'codeceptjs';

setHeadlessWhen(process.env.HEADLESS);

setCommonPlugins();

export const config: RESTConfig = {
  tests: './tests/e2e/**/*.test.ts',
  output: './outputs',
  helpers: {
    REST: {
      endpoint: 'http://localhost:3001',
      timeout: 10000,
    },
  },
  include: {
    I: './steps_file.ts',
  },
  name: 'task-manager-api',
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
  },
}; 