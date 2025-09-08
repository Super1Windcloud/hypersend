<br />
<p>
An efficient server implies a lower cost of the infrastructure, better
responsiveness under load, and happy users. How can you efficiently handle the
resources of your server, knowing that you are serving the highest number of
requests possible, without sacrificing security validations and handy
development?

Enter Fastify. Fastify is a web framework highly focused on providing the best
developer experience with the least overhead and a powerful plugin architecture.
It is inspired by Hapi and Express and as far as we know, it is one of the
fastest web frameworks in town.

The `main` branch refers to the Fastify `v5` release.
Check out the [`4.x` branch](https://github.com/fastify/fastify/tree/4.x) for `v4`.

</p>   
### Table of Contents

- [Quick start](#quick-start)
- [Install](#install)
- [Example](#example)
- [Core features](#core-features)
- [Benchmarks](#benchmarks)
- [Documentation](#documentation)
- [Ecosystem](#ecosystem)
- [Support](#support)
- [Team](#team)
- [Hosted by](#hosted-by)
- [License](#license)

### Quick start

Create a folder and make it your current working directory:

```sh
mkdir my-app
cd my-app
```

Generate a fastify project with `npm init`:

```sh
npm init fastify
```

Install dependencies:

```sh
npm i
```

To start the app in dev mode:

```sh
npm run dev
```

For production mode:

```sh
npm start
```

Under the hood `npm init` downloads and runs [Fastify
Create](https://github.com/fastify/create-fastify), which in turn uses the
generate functionality of [Fastify CLI](https://github.com/fastify/fastify-cli).

### Install

To install Fastify in an existing project as a dependency:

```sh
npm i fastify
```

### Example

```js
// Require the framework and instantiate it

// ESM
import Fastify from 'public/fastify'

const fastify = Fastify({
  logger: true
})
// CommonJs
const fastify = require('public/fastify')({
  logger: true
})

// Declare a route
fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
```

With async-await:

```js
// ESM
import Fastify from 'public/fastify'

const fastify = Fastify({
  logger: true
})
// CommonJs
const fastify = require('public/fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
```

Do you want to know more? Head to the <a
href="./docs/Guides/Getting-Started.md"><code><b>Getting Started</b></code></a>.
If you learn best by reading code, explore the official [demo](https://github.com/fastify/demo).

> ## Note
>
> `.listen` binds to the local host, `localhost`, interface by default
> (`127.0.0.1` or `::1`, depending on the operating system configuration). If
> you are running Fastify in a container (Docker,
> [GCP](https://cloud.google.com/), etc.), you may need to bind to `0.0.0.0`. Be
> careful when listening on all interfaces; it comes with inherent
> [security
> risks](https://web.archive.org/web/20170711105010/https://snyk.io/blog/mongodb-hack-and-secure-defaults/).
> See [the documentation](./docs/Reference/Server.md#listen) for more
> information.

### Core features

- **Highly performant:** as far as we know, Fastify is one of the fastest web
  frameworks in town, depending on the code complexity we can serve up to 76+
  thousand requests per second.
- **Extensible:** Fastify is fully extensible via its hooks, plugins, and
  decorators.
- **Schema-based:** even if it is not mandatory we recommend using [JSON
  Schema](https://json-schema.org/) to validate your routes and serialize your
  outputs. Internally Fastify compiles the schema in a highly performant
  function.
- **Logging:** logs are extremely important but are costly; we chose the best
  logger to almost remove this cost, [Pino](https://github.com/pinojs/pino)!
- **Developer friendly:** the framework is built to be very expressive and help
  developers in their daily use without sacrificing performance and
  security.

### Benchmarks

**Machine:** EX41S-SSD, Intel Core i7, 4Ghz, 64GB RAM, 4C/8T, SSD.

**Method:**: `autocannon -c 100 -d 40 -p 10 localhost:3000` \* 2, taking the
second average

| Framework     | Version   |   Router?    | Requests/sec |
| :------------ | :-------- | :----------: | -----------: |
| Express       | 4.17.3    |   &#10003;   |       14,200 |
| hapi          | 20.2.1    |   &#10003;   |       42,284 |
| Restify       | 8.6.1     |   &#10003;   |       50,363 |
| Koa           | 2.13.0    |   &#10007;   |       54,272 |
| **Fastify**   | **4.0.0** | **&#10003;** |   **77,193** |
| -             |           |              |              |
| `http.Server` | 16.14.2   |   &#10007;   |       74,513 |

These benchmarks taken using https://github.com/fastify/benchmarks. This is a
synthetic "hello world" benchmark that aims to evaluate the framework overhead.
The overhead that each framework has on your application depends on your
application. You should **always** benchmark if performance matters to you.

## Documentation

- [**`Getting Started`**](./docs/Guides/Getting-Started.md)
- [**`Guides`**](./docs/Guides/Index.md)
- [**`Server`**](./docs/Reference/Server.md)
- [**`Routes`**](./docs/Reference/Routes.md)
- [**`Encapsulation`**](./docs/Reference/Encapsulation.md)
- [**`Logging`**](./docs/Reference/Logging.md)
- [**`Middleware`**](./docs/Reference/Middleware.md)
- [**`Hooks`**](./docs/Reference/Hooks.md)
- [**`Decorators`**](./docs/Reference/Decorators.md)
- [**`Validation and Serialization`**](./docs/Reference/Validation-and-Serialization.md)
- [**`Fluent Schema`**](./docs/Guides/Fluent-Schema.md)
- [**`Lifecycle`**](./docs/Reference/Lifecycle.md)
- [**`Reply`**](./docs/Reference/Reply.md)
- [**`Request`**](./docs/Reference/Request.md)
- [**`Errors`**](./docs/Reference/Errors.md)
- [**`Content Type Parser`**](./docs/Reference/ContentTypeParser.md)
- [**`Plugins`**](./docs/Reference/Plugins.md)
- [**`Testing`**](./docs/Guides/Testing.md)
- [**`Benchmarking`**](./docs/Guides/Benchmarking.md)
- [**`How to write a good plugin`**](./docs/Guides/Write-Plugin.md)
- [**`Plugins Guide`**](./docs/Guides/Plugins-Guide.md)
- [**`HTTP2`**](./docs/Reference/HTTP2.md)
- [**`Long Term Support`**](./docs/Reference/LTS.md)
- [**`TypeScript and types support`**](./docs/Reference/TypeScript.md)
- [**`Serverless`**](./docs/Guides/Serverless.md)
- [**`Recommendations`**](./docs/Guides/Recommendations.md)

## Ecosystem

- [Core](./docs/Guides/Ecosystem.md#core) - Core plugins maintained by the
  _Fastify_ [team](#team).
- [Community](./docs/Guides/Ecosystem.md#community) - Community-supported
  plugins.
- [Live Examples](https://github.com/fastify/example) - Multirepo with a broad
  set of real working examples.
- [Discord](https://discord.gg/D3FZYPy) - Join our discord server and chat with
  the maintainers.

## Support

Please visit [Fastify help](https://github.com/fastify/help) to view prior
support issues and to ask new support questions.

Version 3 of Fastify and lower are EOL and will not receive any security or bug fixes.

Fastify's partner, HeroDevs, provides commercial security fixes for all
unsupported versions at [https://herodevs.com/support/fastify-nes][hd-link].
Fastify's supported version matrix is available in the
[Long Term Support][lts-link] documentation.

## Contributing

Whether reporting bugs, discussing improvements and new ideas, or writing code,
we welcome contributions from anyone and everyone. Please read the [CONTRIBUTING](./CONTRIBUTING.md)
guidelines before submitting pull requests.

## Team

_Fastify_ is the result of the work of a great community. Team members are
listed in alphabetical order.

**Lead Maintainers:**

- [**Matteo Collina**](https://github.com/mcollina),
  <https://twitter.com/matteocollina>, <https://www.npmjs.com/~matteo.collina>
- [**Tomas Della Vedova**](https://github.com/delvedor),
  <https://twitter.com/delvedor>, <https://www.npmjs.com/~delvedor>
- [**KaKa Ng**](https://github.com/climba03003),
  <https://www.npmjs.com/~climba03003>
- [**Manuel Spigolon**](https://github.com/eomm),
  <https://twitter.com/manueomm>, <https://www.npmjs.com/~eomm>
- [**James Sumners**](https://github.com/jsumners),
  <https://twitter.com/jsumners79>, <https://www.npmjs.com/~jsumners>

### Fastify Core team

- [**Aras Abbasi**](https://github.com/uzlopak),
  <https://www.npmjs.com/~uzlopak>
- [**Harry Brundage**](https://github.com/airhorns/),
  <https://twitter.com/harrybrundage>, <https://www.npmjs.com/~airhorns>
- [**Matteo Collina**](https://github.com/mcollina),
  <https://twitter.com/matteocollina>, <https://www.npmjs.com/~matteo.collina>
- [**Gürgün Dayıoğlu**](https://github.com/gurgunday),
  <https://www.npmjs.com/~gurgunday>
- [**Tomas Della Vedova**](https://github.com/delvedor),
  <https://twitter.com/delvedor>, <https://www.npmjs.com/~delvedor>
- [**Carlos Fuentes**](https://github.com/metcoder95),
  <https://twitter.com/metcoder95>, <https://www.npmjs.com/~metcoder95>
- [**Vincent Le Goff**](https://github.com/zekth)
- [**Luciano Mammino**](https://github.com/lmammino),
  <https://twitter.com/loige>, <https://www.npmjs.com/~lmammino>
- [**KaKa Ng**](https://github.com/climba03003),
  <https://www.npmjs.com/~climba03003>
- [**Luis Orbaiceta**](https://github.com/luisorbaiceta),
  <https://twitter.com/luisorbai>, <https://www.npmjs.com/~luisorbaiceta>
- [**Maksim Sinik**](https://github.com/fox1t),
  <https://twitter.com/maksimsinik>, <https://www.npmjs.com/~fox1t>
- [**Manuel Spigolon**](https://github.com/eomm),
  <https://twitter.com/manueomm>, <https://www.npmjs.com/~eomm>
- [**James Sumners**](https://github.com/jsumners),
  <https://twitter.com/jsumners79>, <https://www.npmjs.com/~jsumners>

### Fastify Plugins team

- [**Harry Brundage**](https://github.com/airhorns/),
  <https://twitter.com/harrybrundage>, <https://www.npmjs.com/~airhorns>
- [**Simone Busoli**](https://github.com/simoneb),
  <https://twitter.com/simonebu>, <https://www.npmjs.com/~simoneb>
- [**Dan Castillo**](https://github.com/dancastillo),
  <https://www.npmjs.com/~dancastillo>
- [**Matteo Collina**](https://github.com/mcollina),
  <https://twitter.com/matteocollina>, <https://www.npmjs.com/~matteo.collina>
- [**Gürgün Dayıoğlu**](https://github.com/gurgunday),
  <https://www.npmjs.com/~gurgunday>
- [**Tomas Della Vedova**](https://github.com/delvedor),
  <https://twitter.com/delvedor>, <https://www.npmjs.com/~delvedor>
- [**Carlos Fuentes**](https://github.com/metcoder95),
  <https://twitter.com/metcoder95>, <https://www.npmjs.com/~metcoder95>
- [**Vincent Le Goff**](https://github.com/zekth)
- [**Jean Michelet**](https://github.com/jean-michelet),
  <https://www.npmjs.com/~jean-michelet>
- [**KaKa Ng**](https://github.com/climba03003),
  <https://www.npmjs.com/~climba03003>
- [**Maksim Sinik**](https://github.com/fox1t),
  <https://twitter.com/maksimsinik>, <https://www.npmjs.com/~fox1t>
- [**Frazer Smith**](https://github.com/Fdawgs), <https://www.npmjs.com/~fdawgs>
- [**Manuel Spigolon**](https://github.com/eomm),
  <https://twitter.com/manueomm>, <https://www.npmjs.com/~eomm>

### Emeritus Contributors

Great contributors to a specific area of the Fastify ecosystem will be invited
to join this group by Lead Maintainers when they decide to step down from the
active contributor's group.

- [**Tommaso Allevi**](https://github.com/allevo),
  <https://twitter.com/allevitommaso>, <https://www.npmjs.com/~allevo>
- [**Ethan Arrowood**](https://github.com/Ethan-Arrowood/),
  <https://twitter.com/arrowoodtech>, <https://www.npmjs.com/~ethan_arrowood>
- [**Çağatay Çalı**](https://github.com/cagataycali),
  <https://twitter.com/cagataycali>, <https://www.npmjs.com/~cagataycali>
- [**David Mark Clements**](https://github.com/davidmarkclements),
  <https://twitter.com/davidmarkclem>,
  <https://www.npmjs.com/~davidmarkclements>
- [**dalisoft**](https://github.com/dalisoft), <https://twitter.com/dalisoft>,
  <https://www.npmjs.com/~dalisoft>
- [**Dustin Deus**](https://github.com/StarpTech),
  <https://twitter.com/dustindeus>, <https://www.npmjs.com/~starptech>
- [**Denis Fäcke**](https://github.com/SerayaEryn),
  <https://twitter.com/serayaeryn>, <https://www.npmjs.com/~serayaeryn>
- [**Rafael Gonzaga**](https://github.com/rafaelgss),
  <https://twitter.com/_rafaelgss>, <https://www.npmjs.com/~rafaelgss>
- [**Trivikram Kamat**](https://github.com/trivikr),
  <https://twitter.com/trivikram>, <https://www.npmjs.com/~trivikr>
- [**Ayoub El Khattabi**](https://github.com/AyoubElk),
  <https://twitter.com/ayoubelkh>, <https://www.npmjs.com/~ayoubelk>
- [**Cemre Mengu**](https://github.com/cemremengu),
  <https://twitter.com/cemremengu>, <https://www.npmjs.com/~cemremengu>
- [**Salman Mitha**](https://github.com/salmanm),
  <https://www.npmjs.com/~salmanm>
- [**Nathan Woltman**](https://github.com/nwoltman),
  <https://twitter.com/NathanWoltman>, <https://www.npmjs.com/~nwoltman>

## Hosted by

[<img
src="https://github.com/openjs-foundation/artwork/blob/main/openjs_foundation/openjs_foundation-logo-horizontal-color.png?raw=true"
width="250px;"/>](https://openjsf.org/projects)

We are an [At-Large
Project](https://github.com/openjs-foundation/cross-project-council/blob/HEAD/PROJECT_PROGRESSION.md#at-large-projects)
in the [OpenJS Foundation](https://openjsf.org/).

## Sponsors

Support this project by becoming a [SPONSOR](./SPONSORS.md)!
Fastify has an [Open Collective](https://opencollective.com/fastify)
page where we accept and manage financial contributions.

## Acknowledgments

This project is kindly sponsored by:

- [NearForm](https://nearform.com)
- [Platformatic](https://platformatic.dev)

Past Sponsors:

- [LetzDoIt](https://www.letzdoitapp.com/)

This list includes all companies that support one or more team members
in maintaining this project.

## License

Licensed under [MIT](./LICENSE).

For your convenience, here is a list of all the licenses of our production
dependencies:

- MIT
- ISC
- BSD-3-Clause
- BSD-2-Clause

[hd-link]: https://www.herodevs.com/support/fastify-nes?utm_source=fastify&utm_medium=link&utm_campaign=github_readme
[lts-link]: https://fastify.dev/docs/latest/Reference/LTS/
