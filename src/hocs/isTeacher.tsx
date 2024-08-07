import { Role } from "../types/auth";
import { auth } from "@/auth";

export default function isTeacher(Component: any) {
  return async function IsTeacher(props: any) {
    const session = await auth();

    if (!session) {
      return <p>Nepřihlášený uživatel</p>;
    }
    if (
      session.user?.role !== Role.ADMIN &&
      session.user?.role !== Role.TEACHER
    ) {
      return <p>Přístup odepřen</p>;
    }

    return <Component {...props} />;
  };
}
