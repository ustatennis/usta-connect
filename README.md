# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.hlx.page/
- Live: https://main--{repo}--{owner}.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
3. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
4. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
5. Start Franklin Proxy with scss watcher(for styling): `npm run hlx` (opens your browser at `http://localhost:3000`)
6. Open the `{repo}` directory in your favorite IDE and start coding :)
