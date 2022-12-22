import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { oppRouter } from "./opp";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  opp: oppRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
