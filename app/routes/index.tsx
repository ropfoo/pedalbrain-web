import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {user ? (
          <Link
            to="/notes"
            className="text-yellow-700 hover:bg-yellow-50 flex items-center justify-center rounded-md border border-transparent bg-blue px-4 py-3 text-base font-medium shadow-sm sm:px-8"
          >
            View Notes for {user.email}
          </Link>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link
              to="/join"
              className="text-yellow-700 hover:bg-yellow-50 flex items-center justify-center rounded-md border border-transparent bg-blue px-4 py-3 text-base font-medium shadow-sm sm:px-8"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center rounded-md px-4 py-3 font-medium text-white  "
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
