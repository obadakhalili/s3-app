# S3-App

This is a Node.js web application that allows you to upload, list and view images stored on an Amazon S3 bucket.

## Requirements

- Node.js
- Yarn
- An Amazon S3 bucket with the following configuration:
  - A unique bucket name
  - Public read access for objects

## Getting started

1. Clone this repository
2. Run `yarn install` to install the dependencies
3. Create a `.env` file with your AWS credentials and bucket name (see `.env.sample` for an example)
4. Run `yarn start` to start the application
5. Access `http://localhost:3000/images` on your web browser to list the images

## Configuration

The application is configured using the `package.json` file, which specifies the dependencies and the start script. The `start` script loads the environment variables from the `.env` file using the `dotenv` package and starts the application using the `node` command.

The `app.js` file contains the application code, which creates an Express server and defines three endpoints:

- `GET /images`: lists the images stored on the S3 bucket.
- `GET /images/:filename`: retrieves an image from the S3 bucket and returns it to the client.
- `POST /images`: uploads an image to the S3 bucket.

The application uses the `aws-sdk` package to interact with S3. The AWS credentials are loaded from the environment variables (`process.env.AWS_ACCESS_KEY_ID` and `process.env.AWS_SECRET_KEY`) and used to create an instance of the `AWS.S3` class. The S3 bucket name is also loaded from the environment variable `process.env.AWS_BUCKET_NAME`.

The `multer` middleware is used to handle file uploads. The `upload.single("image")` method specifies that the uploaded file should be stored in memory and should have the field name "image". The uploaded file is then saved to S3 using the `s3.upload` method.
