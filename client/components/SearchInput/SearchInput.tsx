"use client";
import { useSnippetContext } from "@/context/snippetsContext";
import SearchIcon from "@/public/Icons/SearchIcon";
import React, { useCallback, useEffect } from "react";
import lodash from "lodash";
import { usePathname } from "next/navigation";
import { useUserContext } from "@/context/userContext";

interface Props {
  wFull?: boolean;
}

function SearchInput({ wFull }: Props) {
  const {
    getPublicSnippets,
    getPopularSnippets,
    getLikedSnippets,
    getUserSnippets,
    getLeaderboard,
  } = useSnippetContext();
  const userId = useUserContext().user._id;

  const [searchQuery, setSearchQuery] = React.useState("");

  const pathname = usePathname();

  const debouncedSearchQuery = useCallback(
    lodash.debounce((query: string) => {
      if (query) {
        switch (pathname) {
          case "/":
            getPublicSnippets("", "", query);
            break;
          case "/popular":
            getPopularSnippets("", query);
            break;
          case "/favourites":
            getLikedSnippets("", query);
            break;
          case "/snippets":
            getUserSnippets("", query);
            break;
        }
      } else {
        getPublicSnippets();
        getPopularSnippets();
        getLeaderboard();

        if (userId) {
          getLikedSnippets();
          getUserSnippets();
        }
      }
    }, 500),
    [pathname]
  );

  useEffect(() => {
    debouncedSearchQuery(searchQuery);

    // cnacel the debounce function on unmount
    return () => {
      debouncedSearchQuery.cancel();
    };
  }, [searchQuery, debouncedSearchQuery]);

  return (
    <form
      className={`relative flex gap-4 overflow-hidden ${
        wFull ? "w-full" : "md:w-[580px]"
      }`}
    >
      <div className="absolute top-[50%] left-3 translate-y-[-50%]">
        <SearchIcon stroke="rgba(249,249,249,0.6)" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`pl-10 pr-2 py-2 bg-2 text-gray-200 font-medium border-[2px] border-rgba-2 rounded-lg outline-none transition-all duration-300 ease-in-out focus:w-full focus:border-rgba-0 ${
          wFull ? "w-full" : "w-[90%]"
        }`}
      />
      {!searchQuery && (
        <span className="absolute top-[50%] left-10 translate-y-[-50%] text-gray-400 pointer-events-none text-nowrap">
          Search for snippets e.g. Nested Loops etc.
        </span>
      )}
    </form>
  );
}

export default SearchInput;
