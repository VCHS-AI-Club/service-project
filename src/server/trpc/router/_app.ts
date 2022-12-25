import { router } from "../trpc";
import { authRouter } from "./auth";
import { oppRouter } from "./opp";

export const appRouter = router({
  auth: authRouter,
  opp: oppRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
