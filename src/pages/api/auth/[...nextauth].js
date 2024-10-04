import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_API_SERVICE_BASE_URL;

export const authOptions = {
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const { username, password } = credentials;
                const res = await axios({
                    url: "https://localhost:7137/api/Users/login",
                    method: "post",
                    data: {
                        username,
                        password
                    },
                    
                });

                const user = await res;

                if (!user) return null;

                return user.data;
            }
        })
    ],
    refetchInterval: 60,
    session: {
        strategy: "jwt",
        maxAge: 4 * 60 * 60
    },
    pages: {
        signIn: "/auth/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token["token"] = user["token"];
                token["refreshToken"] = user["refreshToken"];
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        }
    }
};
export default NextAuth(authOptions);

// helper function to only include org name and code
const constructOrganizations = (arr) => {
    let organizations = [];
    for (let i = 0; i < arr?.length; i++) {
        organizations.push({ name: arr[i]?.name, organizationCode: arr[i]?.organizationCode, logo: arr[i]?.logo });
    }
    return organizations;
};
