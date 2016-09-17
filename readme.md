# Prerequisites

Copy to Contao root.

Node.js has to be installed. https://nodejs.org

Ruby has to be installed. https://www.ruby-lang.org

Ruby gem Sass has to be installed. `gem install sass`

Add `gruntfile.js`, `package.json` and optionally `.gitignore` to contao root.

Run `npm install` in contao root folder to install packages from the `package.json`.

# Usage

Run `grunt init` to build folder tree and create initial files for Contao scope.

Run `grunt js` to concat and uglify all js files

Run `grunt style` to concat, prefix, etc. the css

Run `grunt img` to auto compress images

Run `grunt watch` to let grunt handle all js, style and img actions on change

Run `grunt` (that is the default task) to run js, style and img all together

Working files are under `files/layout/resources/`.

Compiled files are put into `files/layout/resources/build/`.

# Explanation

Packages are combined for a maximum automation.

Css processors are taking care of prefixing, adding rem fallback, minifying (that
includes optimisation, see http://cssnano.co/ for full features).