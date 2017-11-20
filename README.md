# Relayd

Relayd is a reddit-like app made for private groups to share links and have discussions.

It is built using elixir, phoenix, and react.

## Get Started

### Phoenix Server

Install elixir and postgres, get deps (`mix deps.get`), get node modules (`npm install` or `yarn install`).

Create db (`mix ecto.create`), run migrations (`mix ecto.migrate`) and seed the db (`mix phoenix.seed`).

Launch server with `iex -S mix phoenix.server`.

Go to [localhost:4000](http://localhost:4000)

### Mobile App

Get [Expo](https://expo.io/).

Cd into `./mobile` and get node modules with `npm install` or `yarn install`.

Open expo xde and follow prompts to set up new project using the ./mobile dir.

Share project to your phone.
