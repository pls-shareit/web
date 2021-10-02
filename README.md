# ShareIt Web Frontend

A modern-looking web frontend for [ShareIt](https://github.com/pls-shareit/api).

## Setup

The files that make up the frontend are built using [Vue](https://vuejs.org).
You can either install the relevant tools to build the frontend yourself, or
grab a pre-built ZIP file.

You should set up the API server before setting up the frontend, if you haven't
already done so.

### 1a: Get a ZIP file

[Click here to download](https://github.com/pls-shareit/web/releases/latest/download/frontend.zip),
then use your tool of choice to unzip the file.

ALternatively, from a Unix-like command line:

```bash
wget https://github.com/pls-shareit/web/releases/latest/download/frontend.zip
unzip frontend
```

### 1b: Build it Yourself

 1. Install [Node.js](https://nodejs.org).

    This is the language that tooling for Vue is written in.

 2. Install [Yarn](https://yarnpkg.com).

    Yarn is a package manager for Node.js.

 3. Run `yarn install` to install the dependencies.
 4. Run `yarn build` to build the files.

    The files should now be in the `frontend` directory.

### Install

Whichever of the above methods you chose, you should now have a directory
called `frontend` in your current working directory.

On Unix, you may wish to move the directory to a more conventional location,
for example: `sudo mv frontend /srv/shareit/frontend`.

Then, to install the frontend, edit the TOML file that contains your server
configuration (you should have created this when you set up the API server),
and `frontend_path` key. The value should be the path to the `frontend` folder.

For example, you might edit the file to add the following line:

```toml
frontend_path = "/srv/shareit/frontend"
```

This should not be under any TOML `[table]`.

Finally, restart the API server, and you should be good to go!

## Development

Run `yarn serve` to start a hot-reloading development server. You should be
able to access this server at `http://localhost:3000` or similar - the address
will be printed to the console when the server starts.

You can access the share page by adding `/share` to the end of the URL.

**TODO**: Make the share page work with an API server or mock data?

You can lint the project with `yarn lint`, and use `yarn lint --fix` to apply
automatic linting fixes.
