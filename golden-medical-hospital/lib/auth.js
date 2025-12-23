
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import Patient from "@/models/patient.js";
import Doctor from "@/models/doctor.js";
import { connectDB } from "./db.js";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
        role: {},
      },

      async authorize(credentials) {
        await connectDB();

        const { email, password, role } = credentials;

      
        if (role === "admin") {
          if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
          ) {
            return {
              id: "admin",
              name: "Admin",
              email,
              role: "admin",
              profileComplete: true,
            };
          }
          return null;
        }

        let user = null;
        if (role === "patient") {
          user = await Patient.findOne({ email });
        } else if (role === "doctor") {
          user = await Doctor.findOne({ email });
        }

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role,
          profileComplete: user.profileComplete ?? false,
          status: user.status ?? null,
        };
      },
    }),
  ],

  callbacks: {
    
    async jwt({ token, user }) {
      
      if (user) {
        token.email = user.email ?? token.email;
        token.role = user.role ?? token.role;
        token.id = user.id ?? token.id;
        token.profileComplete =
          user.profileComplete ?? token.profileComplete ?? false;
        token.status = user.status ?? token.status ?? null;
      }

      if (!token.role && token.email) {
        try {
          await connectDB();

          const doctor = await Doctor.findOne({ email: token.email }).select(
            "profileComplete status"
          );
          if (doctor) {
            token.role = "doctor";
            token.profileComplete = doctor.profileComplete ?? false;
            token.status = doctor.status ?? null;
            return token;
          }

          const patient = await Patient.findOne({ email: token.email }).select(
            "profileComplete"
          );
          if (patient) {
            token.role = "patient";
            token.profileComplete = patient.profileComplete ?? false;
            return token;
          }

          if (token.email === process.env.ADMIN_EMAIL) {
            token.role = "admin";
            token.profileComplete = true;
            return token;
          }
        } catch (err) {
          console.error("jwt callback DB lookup error:", err);
        }
      }

      token.profileComplete = token.profileComplete ?? false;
      token.role = token.role ?? null;

      return token;
    },

    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id ?? session.user.id ?? null;
      session.user.role = token.role ?? session.user.role ?? null;
      session.user.profileComplete =
        token.profileComplete ?? session.user.profileComplete ?? false;
      session.user.status = token.status ?? session.user.status ?? null;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
