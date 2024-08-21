# korytko-dev

Welcome to the korytko-dev project!  
This repository contains the source code for my personal portfolio built using Next.js.

## Project Status

This project is currently under development and not yet created. Stay tuned for updates!

## Prerequisites

Ensure you have the following installed:

- Node.js (v20.15.1)
- Yarn (v4.4.0)

If using docker:

- Docker (v27.1.1)
- Docker Compose (v2.28.1)

## Running the Project

You can run the project in both development and production environments,
with or without Docker.

### Without Docker

#### Development

1. Clone the repository:

    ```sh
    git clone https://github.com/JakubKorytko/korytko-dev.git
    cd korytko-dev/portfolio
    ```

1. Install dependencies:

    ```sh
    yarn install
    ```

1. Start the development server:

    ```sh
    yarn dev
    ```

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

#### Production

1. Clone the repository:

    ```sh
    git clone https://github.com/JakubKorytko/korytko-dev.git
    cd korytko-dev/portfolio
    ```

1. Build the project:

    ```sh
    yarn build
    ```

1. Start the production server:

    ```sh
    yarn start
    ```

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### With Docker

#### Development

1. Clone the repository:

    ```sh
    git clone https://github.com/JakubKorytko/korytko-dev.git
    cd korytko-dev
    ```

1. Build and start the development containers using Docker Compose:

    ```sh
    docker compose -f docker-compose.dev.yml up --build
    ```

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

#### Production

1. Clone the repository:

    ```sh
    git clone https://github.com/JakubKorytko/korytko-dev.git
    cd korytko-dev
    ```

1. Build and start the production containers using Docker Compose:

    ```sh
    docker compose -f docker-compose.prod.yml up --build
    ```

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, feel free to open an issue or contact me directly.
