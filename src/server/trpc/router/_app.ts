import { router } from "../trpc";
import { authRouter } from "./auth";
import { oppRouter } from "./opp";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  opp: oppRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
