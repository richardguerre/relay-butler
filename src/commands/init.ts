import { Command, flags } from '@oclif/command';
import * as path from 'path';
import * as fs from 'fs';
import * as logSymbols from 'log-symbols';
import cli from 'cli-ux';
import { indexTemplate, UITemplate, queryTemplate, storiesTemplate, templateAPITypes } from '../utils/templates';
import { Config, RelayConfig } from '../utils/types';
import { isRunningInRoot } from '../utils';

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
    if (!isRunningInRoot()) {
      this.error('Cannot run relay-butler outside of project root (i.e. directory where package.json is located)');
    }
    const root = process.cwd();
    const relayButlerDir = path.resolve(root, './.relay-bulter');

    // get schemaPath from relay.config.js
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

    // recursively create .relay-butler/templates directory in project root
    const relayButlerTemplatesDir = path.resolve(relayButlerDir, './templates');
    cli.action.start('Creating .relay-bulter directory');
    await fs.promises.mkdir(relayButlerTemplatesDir, {
      recursive: true,
    });
    cli.action.stop(logSymbols.success);

    // write .relay-butler/config.js
    const configToWrite: Config = {
      componentsDirectory: './src/components',
      schema: relayConfig?.schema ?? 'ADD SCHEMA PATH HERE',
    };
    cli.action.start('Creating config.js');
    await fs.promises.writeFile(path.resolve(relayButlerDir, './config.js'), `module.exports = ${JSON.stringify(configToWrite, null, 2)}`);
    cli.action.stop(logSymbols.success);

    // create templateAPI.ts in .relay-butler/
    cli.action.start('Creating templateAPI.ts');
    await fs.promises.writeFile(path.resolve(relayButlerDir, './templateAPI.ts'), templateAPITypes);
    cli.action.stop(logSymbols.success);

    // create index template file
    cli.action.start('Creating index component template file');
    await fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './index.tsx.hbs'), indexTemplate);
    cli.action.stop(logSymbols.success);

    // create UI template file
    cli.action.start('Creating UI component template file');
    await fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './{{componentName}}UI.tsx.hbs'), UITemplate);
    cli.action.stop(logSymbols.success);

    // create query template file
    cli.action.start('Creating query component template file');
    await fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './{{componentName}}Query.tsx.hbs'), queryTemplate);
    cli.action.stop(logSymbols.success);

    // create stories template file if project uses storybook
    let createStorybookTemplate = false;
    const rootDirectories = await fs.promises.readdir(root);
    if (rootDirectories.includes('.storybook')) {
      createStorybookTemplate = true;
      this.log('Detected Storybook! Will also create a .stories template.');
    }
    if (createStorybookTemplate || flags.all) {
      cli.action.start('Creating Storybook stories template file');
      await fs.promises.writeFile(path.resolve(relayButlerTemplatesDir, './{{componentName}}.stories.tsx.hbs'), storiesTemplate);
      cli.action.stop(logSymbols.success);
    }

    // .gitignore .relay-butler/input.graphql
    cli.action.start('Adding input.graphql to .gitignore');
    await fs.promises.appendFile(path.resolve(root, './.gitignore'), '\n# relay-butler\n.relay-butler/input.graphql');
    cli.action.stop(logSymbols.success);

    // create .relay-bulter/input.graphql
    cli.action.start('Creating input.graphql file');
    await fs.promises.writeFile(path.resolve(relayButlerDir, './input.graphql'), '');
    cli.action.stop(logSymbols.success);

    this.log(`

You can now check the .relay-butler directory, and make any changes you want. You can refer to templateAPI.ts to write your templates.

  For example, you might want to:
    - check that the schemaPath in config.js is correct.
    - change the path to your import statements in the templates, such as the path to your Relay artifacts (i.e. .../__generated__/...).
    - add/remove a template.
    - change the file extensions to ts, js, or jsx.
    - customize your templates any way you want.
`);
  }
}
