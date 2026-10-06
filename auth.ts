import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        const bishopricUsername = process.env.BISHOPRIC_USERNAME;
        const bishopricPassword = process.env.BISHOPRIC_PASSWORD;

        if (!bishopricUsername || !bishopricPassword) {
          throw new Error(
            "BISHOPRIC_USERNAME and BISHOPRIC_PASSWORD must be set."
          );
        }

        if (username === bishopricUsername && password === bishopricPassword) {
          return { id: "bishopric", name: "Bishopric" };
        }

        return null;
      },
    }),
  ],
});
