import { createFrames as coreCreateFrames, types } from "../core";
import type { NextRequest, NextResponse } from "next/server";
import { CoreMiddleware } from "../middleware";
import { getCurrentUrl } from "./getCurrentUrl";
export { Button, type types } from "../core";

export { fetchMetadata } from "./fetchMetadata";

type CreateFramesForNextJS = types.CreateFramesFunctionDefinition<
  CoreMiddleware,
  (req: NextRequest) => Promise<NextResponse>
>;

/**
 * Creates Frames instance to use with you Next.js server
 *
 * @example
 * import { createFrames, Button } from 'frames.js/next';
 * import { NextApiRequest, NextApiResponse } from 'next';
 *
 * const frames = createFrames();
 * const nextHandler = frames(async (ctx) => {
 *  return {
 *    image: <span>Test</span>,
 *    buttons: [
 *     <Button action="post">
 *        Click me
 *      </Button>,
 *    ],
 *  };
 * });
 *
 * export const GET = nextHandler;
 * export const POST = nextHandler;
 */
// @ts-expect-error
export const createFrames: CreateFramesForNextJS =
  function createFramesForNextJS(options?: types.FramesOptions<any, any>) {
    const frames = coreCreateFrames(options);

    return function createHandler<
      TPerRouteMiddleware extends types.FramesMiddleware<any, any>[],
    >(
      handler: types.FrameHandlerFunction<any, any>,
      handlerOptions?: types.FramesRequestHandlerFunctionOptions<TPerRouteMiddleware>
    ) {
      const handleRequest = frames(handler, handlerOptions);

      return (req) => {
        const url = getCurrentUrl(req) ?? req.url;

        return handleRequest(new Request(url, req));
      };
    };
  };
