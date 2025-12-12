//import dateFormat from "@lib/utils/dateFormat";
import { humanize } from "@lib/utils/textConverter";
import { useEffect, useRef, useState } from "react";

export type SearchItem = {
  slug: string;
  data: any;
  excerpt?: string;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

// Calculate reading time (rough estimate: 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  // Lazy-load Fuse.js on the client to avoid adding it to the main bundle.
  const [fuse, setFuse] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const FuseModule = (await import("fuse.js")).default;
      if (!mounted) return;
      const f = new FuseModule(searchList as any, {
        keys: ["data.title", "data.description", "excerpt", "data.categories", "data.tags"],
        includeMatches: true,
        minMatchCharLength: 3,
        ignoreLocation: true,
        threshold: 0.4,
      });
      setFuse(f);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    let inputResult = [];
    if (inputVal.length > 2 && fuse) {
      inputResult = fuse.search(inputVal);
    }
    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);
    } else {
      history.replaceState(history.state, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <div className="min-h-[45vh]">
      <input
        className="form-input w-full text-center text-dark dark:bg-theme-dark border-dark dark:text-theme-light dark:placeholder-gray-400"
        placeholder="Teclea aquí para buscar"
        type="text"
        name="search"
        value={inputVal}
        onChange={handleChange}
        autoComplete="off"
        autoFocus
        ref={inputRef}
      />

      {inputVal.length > 1 && (
        <div className="my-6 text-center">
          {searchResults?.length}
          {searchResults?.length && searchResults?.length === 1
            ? " resultat"
            : " resultats"}{" "}
          per a <span className="font-bold">"{inputVal}"</span>
        </div>
      )}

      <div className="search-results-grid">
        {searchResults?.map(({ item }) => {
          const readingTime = calculateReadingTime(item.excerpt || "");
          return (
            <article key={item.slug} className="search-result-item" data-post-slug={item.slug}>
              {item.data.image && (
                <a 
                  href={`${import.meta.env.BASE_URL}${item.slug}`} 
                  className="search-result-card group"
                  aria-label={`Llegir article: ${item.data.title}`}
                >
                  <div className="search-result-image-container">
                    <img
                      className="search-result-image"
                      src={item.data.image.src}
                      alt={item.data.title}
                      width={445}
                      height={230}
                      loading="lazy"
                    />
                    <div className="search-result-overlay">
                      <span className="search-result-read-more">Llegir més</span>
                    </div>
                    
                    {/* Reading time badge */}
                    {readingTime > 0 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                        {/* small inline clock icon to avoid react-icons bundle */}
                        <svg className="inline mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M12 7v5l3 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        {readingTime} min
                      </div>
                    )}
                  </div>
                  
                  <div className="search-result-content">
                    <div className="search-result-meta">
                      <div className="search-result-categories">
                        {/* small inline category/tag icon */}
                        <svg className="search-result-icon inline mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M3 7h6v6H3zM15 3h6v6h-6zM15 15h6v6h-6z" fill="currentColor" />
                        </svg>
                        <div className="search-result-category-list">
                          {item.data.categories.map((category: string, i: number) => (
                            <span className="search-result-category">
                              {humanize(category)}{i !== item.data.categories.length - 1 && ","}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="search-result-title">
                      {item.data.title}
                    </h3>
                    
                    <p className="search-result-excerpt">
                      {item.data.description ? item.data.description : item.excerpt}
                    </p>
                    
                  </div>
                </a>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
