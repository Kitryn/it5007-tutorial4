FROM node:16-alpine AS app

ARG migrate=NO

ENV NODE_ENV=production
ENV WORKDIR=/app
ENV MIGRATE=${migrate}

RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
RUN yarn install --frozen-lockfile

RUN echo "Building server" \
    && yarn server:build \
    && echo "Server built"

EXPOSE 3000

CMD ["yarn", "start"]
