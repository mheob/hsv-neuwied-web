import path from 'path';

import fs from 'fs-extra';
import glob from 'glob';
import Listr from 'listr';
import { camelCase, kebabCase, upperFirst } from 'lodash';
import Mustache from 'mustache';
import prompts from 'prompts';
import yargs from 'yargs';

const projectRoot = process.cwd();

async function collectArguments() {
  return yargs
    .scriptName('create-component')
    .version('1.0.0')
    .strict()
    .command('$0', 'Create a new UI component.', (yargs) =>
      yargs.option('appname', {
        alias: 'A',
        desc: 'Application name, can be capital, and space name',
        type: 'string',
      })
    )
    .epilogue(`Copyright 2021 by Alexander Böhm`).argv;
}

async function getArguments() {
  const promptedArguments = await collectArguments();
  return { appName: promptedArguments.appname || '' };
}

type Answers = {
  name: string;
  filepath: string;
  filename: string;
};

async function getPrompts() {
  const argv = await getArguments();

  const response = await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message: 'Application name',
        initial: argv.appName,
      },
      {
        type: 'text',
        name: 'filepath',
        message: 'Package location',
        initial: `${projectRoot}/src/components`,
      },
    ],
    {
      onCancel: () => {
        console.error('Cancelled by the user');
        process.exit(1);
      },
    }
  );

  const data: Answers = {
    name: upperFirst(camelCase(response.name)),
    filepath: response.filepath,
    filename: kebabCase(response.name),
  };

  return data;
}

function prepareFiles(error: Error | null, files: string[], data: Answers) {
  if (error) return;

  const componentPlaceholder = /__COMPONENT_NAME__/;
  const handlebarExtension = /\.__tmpl__$/;

  for (const file of files) {
    if (!fs.statSync(file).isFile()) continue;
    const content = fs.readFileSync(file);
    const newFile = Mustache.render(content.toString(), data);
    fs.outputFileSync(file, newFile);
    const newFileName = file.replace(handlebarExtension, '');
    fs.renameSync(file, newFileName);
    if (!componentPlaceholder.test(newFileName)) continue;
    fs.renameSync(newFileName, newFileName.replace(componentPlaceholder, data.filename));
  }
}

export default async function run(): Promise<void> {
  const progress = new Listr();
  const data = await getPrompts();

  progress.add({
    title: `Creating component folder at ${data.filepath}`,
    task: async (context: { data: Answers }) => {
      const template = fs.realpath(path.join(__dirname, 'template'));
      fs.copySync(await template, context.data.filepath, {
        recursive: true,
        overwrite: true,
      });
    },
  });

  progress.add({
    title: 'Prepare copied files and add component data',
    task: (context: { data: Answers }) => {
      glob(context.data.filepath + '/**/*', (error, files) =>
        prepareFiles(error, files, context.data)
      );
    },
  });

  progress.run({ data });
}
