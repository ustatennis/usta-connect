## Code Of Conduct

This project adheres to the Adobe [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to cstaub at adobe dot com.

## Contributor License Agreement

All third-party contributions to this project must be accompanied by a signed contributor license. This gives Adobe permission to redistribute your contributions as part of the project. [Sign our CLA](http://opensource.adobe.com/cla.html)! You only need to submit an Adobe CLA one time, so if you have submitted one previously, you are good to go!

## Things to Keep in Mind

This project uses a **commit then review** process, which means that for approved maintainers, changes can be merged immediately, but will be reviewed by others.

For other contributors, a maintainer of the project has to approve the pull request.

# Before You Contribute

* Check that there is an existing issue in GitHub issues
* Check if there are other pull requests that might overlap or conflict with your intended contribution

# How to Contribute

1. Fork the repository
2. Make some changes on a branch on your fork
3. Create a pull request from your branch

In your pull request, outline:

* What the changes intend
* How they change the existing code
* If (and what) they breaks
* Start the pull request with the GitHub issue ID, e.g. #123

Lastly, please follow the [pull request template](.github/pull_request_template.md) when submitting a pull request!

Each commit message that is not part of a pull request:

* Should contain the issue ID like `#123`
* Can contain the tag `[trivial]` for trivial changes that don't relate to an issue

* If you are working on a new task:

  * Create a new branch from `develop`
  * Commit your changes to that branch
  * Open a pull request against the `develop` branch
  * Resolve merge conflicts (if any)

## Naming Conventions

In order to keep the git log clean and consistent, please follow these conventions.

### Branch Names

Branches should be named using the following format:

`{token}/{jira-number}?/{task-description}`

**Token can be:**

* `feature`: Tasks to be merged into `develop`
* `hotfix`: Critical bug fixes to be merged into `develop`
* `release`: Staging to be merged into `develop` and `master`

**Please use short and meaningful descriptions for your branch names and use dashes (`-`) as the delimeter.**

**Jira task number is mandatory unless the branch does not belong to Jira task.**

#### Examples

`feature/BMW-1/menu`

`hotfix/agenda-style`


## Coding Styleguides

We enforce a coding styleguide using `eslint`. As part of your build, run `npm run lint` to check if your code is conforming to the style guide. We do the same for every PR in our CI, so PRs will get rejected if they don't follow the style guide.

You can fix some of the issues automatically by running `npx eslint . --fix`.

## Commit Message Format
We use [semantic-release](https://github.com/semantic-release/semantic-release) for release management and require that all commits are properly formatted.

In order to help you craft a good commit message, we added [commitizen](https://www.npmjs.com/package/commitizen) as dev dependency, so you can just run
```bash
$ npm run commit
```

# How Contributions get Reviewed

One of the maintainers will look at the pull request within one week. Feedback on the pull request will be given in writing, in GitHub.

# Release Management

The project's committers will release to the [Adobe organization on npmjs.org](https://www.npmjs.com/org/adobe).
Please contact the [Adobe Open Source Advisory Board](https://git.corp.adobe.com/OpenSourceAdvisoryBoard/discuss/issues) to get access to the npmjs organization.

The release process is fully automated using `semantic-release`, increasing the version numbers, etc. based on the contents of the commit messages found.
