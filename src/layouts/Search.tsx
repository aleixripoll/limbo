//import dateFormat from "@lib/utils/dateFormat";
import CategoryGridIcon from "@components/CategoryGridIcon";
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
  }, [searchList]);

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
  }, [inputVal, fuse]);

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
          const categories = item.data.categories ?? [];
          const imageSrc = item.data.image?.src as string | undefined;
          return (
            <article key={item.slug} className="search-result-item" data-post-slug={item.slug}>
              <a
                href={`${import.meta.env.BASE_URL}${item.slug}`}
                className="search-result-card group"
                aria-label={`Llegir article: ${item.data.title}`}
              >
                <div className="search-result-image-container">
                  {imageSrc ? (
                    <img
                      className="search-result-image"
                      src={imageSrc}
                      alt={item.data.title}
                      width={445}
                      height={230}
                      loading="lazy"
                    />
                  ) : (
                    <div className="masonry-card-placeholder" aria-hidden />
                  )}
                  {imageSrc ? (
                    <div className="search-result-overlay">
                      <span className="search-result-read-more">Llegir més</span>
                    </div>
                  ) : null}
                </div>

                <div className="search-result-content">
                  <div className="search-result-meta">
                    <div className="search-result-categories">
                      <CategoryGridIcon className="search-result-icon inline mr-1 h-4 w-4" />
                      <div className="search-result-category-list">
                        {categories.map((category: string, i: number) => (
                          <span key={`${category}-${i}`} className="search-result-category">
                            {humanize(category)}
                            {i !== categories.length - 1 && ","}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h3 className="search-result-title">{item.data.title}</h3>

                  <p className="search-result-excerpt">
                    {item.data.description ? item.data.description : item.excerpt}
                  </p>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
