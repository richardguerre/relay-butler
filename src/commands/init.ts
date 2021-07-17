import { Command, flags } from '@oclif/command';
import * as path from 'path';
import * as fs from 'fs';
import * as appRoot from 'app-root-path';
import { Config, RelayConfig } from 'utils/types';

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

    // copy templateAPI.ts
    await fs.promises.copyFile(path.resolve(__dirname, '../utils/templateAPI.ts'), path.resolve(relayButlerDir, './templateAPI.ts'));

    // copy all default template .hbs files into .relay-butler/templates/ directory
    const defaultTemplateDirPath = path.resolve(__dirname, '../templates');
    let defaultTemplates = await fs.promises.readdir(defaultTemplateDirPath);
    if (!createStorybookTemplate && !flags.all) {
      defaultTemplates = defaultTemplates.filter((template) => !template.includes('.stories.'));
    }
    for (const template of defaultTemplates) {
      await fs.promises.copyFile(path.resolve(defaultTemplateDirPath, `./${template}`), path.resolve(relayButlerTemplatesDir, `./${template}`));
    }

    // .gitignore .relay-butler/input.graphql
    await fs.promises.appendFile(path.resolve(root, './.gitignore'), '\n# relay-butler\n.relay-butler/input.graphql');

    // create .relay-bulter/input.graphql
    await fs.promises.writeFile(path.resolve(relayButlerDir, './input.graphql'), '');
  }
}
