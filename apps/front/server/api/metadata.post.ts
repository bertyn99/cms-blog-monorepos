import { defineEventHandler, readBody, createError } from "h3";
import urlMetadata from "url-metadata";

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event);

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: "URL is required",
    });
  }

  const options = {
    /*    requestHeaders: {
      "User-Agent": "MyApp/1.0 (contact@example.com)",
    }, */
    timeout: 15000, // 15 seconds
    descriptionLength: 200, // Adjust as needed
    ensureSecureImageRequest: true,
  };

  try {
    const metadata = await urlMetadata(url, options);
    return metadata;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes("CORS")) {
        throw createError({
          statusCode: 403,
          statusMessage: "CORS error: Unable to access the URL",
        });
      } else if (error.message.includes("timeout")) {
        throw createError({
          statusCode: 504,
          statusMessage: "Request timed out",
        });
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: error.message,
        });
      }
    }
    throw createError({
      statusCode: 500,
      statusMessage: "An unknown error occurred.",
    });
  }
});
