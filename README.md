[![Build Status](https://travis-ci.org/thiren/angular-seed.svg?branch=master)](https://travis-ci.org/thiren/angular-seed)

# angular-seed
A project seed for new angular applications


## Getting Started

To get you started you can simply clone the angular-seed repository and install the dependencies:

### Prerequisites

You need git to clone the angular-seed repository. You can get git from [http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test angular-seed. You must have node.js and its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone angular-seed

Clone the angular-seed repository using [git][git]:

```
git clone https://github.com/thiren/angular-seed.git
cd angular-seed
```

If you just want to start a new project without the angular-seed commit history then you can do:

```bash
git clone https://github.com/thiren/angular-seed.git <your-project-name>
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and client-side framework code. The tools help us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the client-side framework code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`. You should find that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `bower_components` - contains the client-side framework files

### Run the Application

We have preconfigured the project with a build step and a simple development web server. The simplest way to start this server is:

```
gulp watch
```

Now browse to the app at `http://localhost:9000`.

You should find that you have one new folder in your project.

* `build` - contains the built angular application and all static website resources


## Directory Layout

```
src/
  app/
    header/
      header.controller.js
      header.tpl.html
    app.module.js
    main.tpl.html
  configs/
    constants.json
  fonts/
  images/
  styles/
    main.less
  favicon.ico
  index.html
tests/
  unit/
    header/
      header.controller.spec.js
karma.config.js
build.config.js
gulpfile.js
```

## Continuous Integration

### Travis CI

[Travis CI][travis] is a continuous integration service, which can monitor GitHub for new commits to your repository and execute scripts such as building the app or running tests. The angular-seed project contains a Travis configuration file, `.travis.yml`, which will cause Travis to run your tests when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the Travis website for more instruction on how to do this.

## Resources

For more information on AngularJS please check out [http://angularjs.org/](http://angularjs.org/)

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[travis]: https://travis-ci.org/
