import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync } from 'fs';
// @ts-ignore
import mime from 'mime';
async function* nodeStreamToIterator(stream: any) {
  for await (const chunk of stream) {
    yield chunk;
  }
}
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value));
      }
    },
  });
}
export const GET = (
  request: NextRequest,
  context: {
    params: {
      path: string[];
    };
  }
) => {
  try {
    const filePath =
      process.env.UPLOAD_DIRECTORY + '/' + context.params.path.join('/');
    
    // Check if file exists before trying to read it
    const fileStats = statSync(filePath);
    const response = createReadStream(filePath);
    const contentType = mime.getType(filePath) || 'application/octet-stream';
    const iterator = nodeStreamToIterator(response);
    const webStream = iteratorToStream(iterator);
    
    return new Response(webStream, {
      headers: {
        'Content-Type': contentType,
        // Set the appropriate content-type header
        'Content-Length': fileStats.size.toString(),
        // Set the content-length header
        'Last-Modified': fileStats.mtime.toUTCString(),
        // Set the last-modified header
        'Cache-Control': 'public, max-age=31536000, immutable', // Example cache-control header
      },
    });
  } catch (error) {
    console.error('File not found:', context.params.path.join('/'), error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
};
