FROM node:20-alpine

RUN useradd -m appuser
USER appuser

WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY src ./src
COPY public ./public
COPY next.config.mjs tsconfig.json i18n.ts  ./
COPY .eslintrc.json .stylelintignore .stylelintrc.json ./
COPY postcss.config.js tailwind.config.ts ./

COPY intl_messages ./intl_messages
COPY cypress ./cypress
COPY .storybook ./.storybook

ENV BUILD_STANDALONE "true"
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build
CMD yarn start
