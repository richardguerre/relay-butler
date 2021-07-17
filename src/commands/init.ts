import { Command, flags } from '@oclif/command';
import * as path from 'path';
import * as fs from 'fs';
import * as appRoot from 'app-root-path';
import { indexTemplate, UITemplate, queryTemplate, storiesTemplate, templateAPITypes } from '../utils/templates';
import { Config, RelayConfig } from '../utils/types';

export default class Init extends Command {
  static description = 'sets up relay-butler by creating config.js, templates/*.hbs files, input.graphql in .relay-butler/ directory.';

  static flags = {
    help: flags.help({ char: 'h', description: 'show help for init command' }),
    all: flags.boolean({
      char: 'a',
      description: 'generate all template files',
    }),
  };

  async run() {
    const startedAt = new Date();
    const { flags } = this.parse(Init);
    const root = appRoot.toString() ?? process.cwd();

    // recursively create .relay-butler/templates directory in project root
    const relayButlerDir = path.resolve(root, './.relay-bulter');
    const relayButlerTemplatesDir = path.resolve(relayButlerDir, './templates');
    await fs.promises.mkdir(relayButlerTemplatesDir, {
      recursive: true,
    });

    // read from relay.config.js
    let relayConfig: RelayConfig | null = null;
    try {
      relayConfig = require(path.resolve(root, './relay.config.js'));
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        this.warn(`Could not find relay.config.js in ${root}. Please make sure that the schemaPath in .relay-butler/config.json is correct.`);
      } else {
        this.error(err);
      }
    }

    // detect if .storybook exists and whether to create storybook template
    let createStorybookTemplate = false;
    const rootDirectories = await fs.promises.readdir(root);
    if (rootDirectories.includes('.storybook')) {
      createStorybookTemplate = true;
    }

    // write .relay-butler/config.json
    const configToWrite: Config = {
      componentsDirectory: './src/components',
      schema: relayConfig?.schema ?? 'ADD SCHEMA PATH HERE',
    };
    await fs.promises.writeFile(path.resolve(relayButlerDir, './config.js'), `module.exports = ${JSON.stringify(configToWrite, null, 2)}`);

    // create templateAPI.ts in .relay-butler/
    await fs.promises.writeFile(path.resolve(relayButlerDir, './templateAPI.ts'), templateAPITypes);

    // create index template file
    await fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './index.tsx.hbs'), indexTemplate);

    // create UI template file
    await fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './{{componentName}}UI.tsx.hbs'), UITemplate);

    // create query template file
    await fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './{{componentName}}Query.tsx.hbs'), queryTemplate);

    // create stories template file if project uses storybook
    if (createStorybookTemplate || flags.all) {
      fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './{{componentName}}.stories.tsx.hbs'), storiesTemplate);
    }

    // .gitignore .relay-butler/input.graphql
    await fs.promises.appendFile(path.resolve(root, './.gitignore'), '\n# relay-butler\n.relay-butler/input.graphql');

    // create .relay-bulter/input.graphql
    await fs.promises.writeFile(path.resolve(relayButlerDir, './input.graphql'), '');

    this.log(`✨  Done in ${(new Date().getTime() - startedAt.getTime()) / 1000}s.`);
  }
}
