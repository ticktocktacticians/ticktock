import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SANDBOXES = [
  {
    title: "Edwin",
    path: "/edwin",
  },
  {
    title: "Darrel",
    path: "/darrel",
  },
  {
    title: "Joel",
    path: "/joel",
  },
];

export default function SandboxLinks() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Sandbox</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {SANDBOXES.map((sandbox) => (
            <NavigationMenuLink asChild key={sandbox.title}>
              <a href={`/sandbox${sandbox.path}`}>
                <DropdownMenuItem>
                  <div>{sandbox.title}</div>
                </DropdownMenuItem>
              </a>
            </NavigationMenuLink>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
