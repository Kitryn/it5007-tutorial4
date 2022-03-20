FROM node:16-alpine AS app

ARG migrate=NO

ENV NODE_ENV=production
ENV WORKDIR=/app
ENV MIGRATE=${migrate}

RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

COPY . .
RUN yarn install --frozen-lockfile

RUN echo "Building common" \ 
    && yarn common:build \
    && echo "Build artifacts ready for extraction"

RUN echo "Building server" \
    && yarn server:build \
    && echo "Server built"

RUN echo "Building client" \
    && yarn client:build \
    && echo "Build artifacts ready for extraction"

RUN echo "Copying build artifacts to server directory" \
    && cp -r ./client/build ./server/build

EXPOSE 3000

CMD ["yarn", "server:start"]
