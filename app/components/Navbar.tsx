import { ThemeToggle } from './Themetoggle';
import { Button } from '@/components/ui/button';
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { UserNav } from './UserNav';

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="border-b bg-background h-auto flex items-center py-4">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
      <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
  Quick<span className="text-primary">PaperAI</span>
</h1>

        <div className="flex items-center gap-x-2 md:gap-x-4">
          <ThemeToggle />
          {(await isAuthenticated()) ? (
            <UserNav
              email={user?.email as string} 
              image={user?.picture as string} 
              name={user?.given_name as string} 
            />
          ) : (
            <div className="flex items-center gap-x-2 md:gap-x-4">
              <LoginLink>
                <Button size="sm" className="text-sm md:text-base">Sign In</Button>
              </LoginLink>
              <RegisterLink>
                <Button size="sm" className="text-sm md:text-base" variant="secondary">Sign Up</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
