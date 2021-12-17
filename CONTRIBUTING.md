# Contributing

## Getting Started

> This project adheres to the Contributor Covenant [code of conduct](./CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

First, create a fork of the [open-wc/api-viewer-element](https://github.com/open-wc/api-viewer-element) repository by hitting the `fork` button on the GitHub page.

Next, clone your fork onto your computer (replacing YOUR_USERNAME with your actual GitHub username).

```sh
git clone git@github.com:YOUR_USERNAME/api-viewer-element.git
```

Once cloning is complete, change directory to the repository and add the upstream project as a remote.

```sh
cd web
git remote add upstream git@github.com:open-wc/api-viewer-element.git
```

## Preparing Your Local Environment for Development

Now that you have cloned the repository, ensure you have [Node.js](https://nodejs.org/en/download/) installed (we recommend Node 16.13 LTS), then run the following command to set up the development environment.

```sh
npm install
```

This will download and install all packages needed.

## Making Your Changes

First, update your fork with the latest code from upstream, then create a new branch for your work.

```sh
git checkout master
git pull upstream master --rebase
git checkout -b my-awesome-fix
```

### Linting

Commits are linted using precommit hooks, meaning that any code that raises a linting error cannot be committed. In order to help avoid that, we recommend using an IDE or editor with an ESLint plugin in order to streamline the development process. Plugins are available for all the popular editors. For more information see [ESLint Integrations](https://eslint.org/docs/user-guide/integrations)

## Committing Your Changes

Commit messages must follow the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/).

## Create a Pull Request

After you commit your changes, it's time to push your branch.

```sh
git push -u origin my-awesome-fix
```

After a successful push, visit your fork on GitHub. You should see a button that will allow you to create a pull request.
