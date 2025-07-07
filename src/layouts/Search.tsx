import config from "@config/config.json";
//import dateFormat from "@lib/utils/dateFormat";
import { humanize, slugify } from "@lib/utils/textConverter";
import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { BiCategoryAlt, BiUser } from "react-icons/bi/index.js";
const { summary_length } = config.settings;

export type SearchItem = {
  slug: string;
  data: any;
  content: any;
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

  const fuse = new Fuse(searchList, {
    keys: ["data.title", "data.description", "content", "data.categories", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 3,
    ignoreLocation: true,
    threshold: 0.4,
  });

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
    let inputResult = inputVal.length > 2 ? fuse.search(inputVal) : [];
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
          per <span className="font-semibold">'{inputVal}'</span>
        </div>
      )}

      <div className="search-results-grid">
        {searchResults?.map(({ item }) => (
          <article key={item.slug} className="search-result-item">
            {item.data.image && (
              <a href={`${import.meta.env.BASE_URL}${item.slug}`} className="search-result-card group">
                <div className="search-result-image-container">
                  <img
                    className="search-result-image"
                    src={item.data.image.src}
                    alt={item.data.title}
                    width={445}
                    height={230}
                  />
                  <div className="search-result-overlay">
                    <span className="search-result-read-more">Llegir més</span>
                  </div>
                </div>
                
                <div className="search-result-content">
                  <div className="search-result-meta">
                    <div className="search-result-categories">
                      <BiCategoryAlt className="search-result-icon" />
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
                    {item.data.description ? item.data.description :
                    item.content?.slice(0, Number(summary_length)) + "..."}
                  </p>
                </div>
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
