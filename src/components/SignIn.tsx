import { signIn } from "next-auth/react";
import { Button } from "./ui";

const SignIn = () => {
  return (
    <div className="grid min-h-screen place-items-center pt-32">
      <div className="flex flex-col justify-center gap-4">
        <h1>You must be signed in to see this content.</h1>
        <Button onClick={() => signIn("google")}>Sign In</Button>
      </div>
    </div>
  );
};

export default SignIn;
