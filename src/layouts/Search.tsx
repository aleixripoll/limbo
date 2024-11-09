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
            ? " resultado"
            : " resultados"}{" "}
          para <span className="font-semibold">'{inputVal}'</span>
        </div>
      )}

      <div className="row">
        {searchResults?.map(({ item }) => (
          <div key={item.slug} className={"col-12 mb-8 sm:col-6 text-center"}>
            {item.data.image && (
              <a href={`${import.meta.env.BASE_URL}${item.slug}`} className="rounded-lg block hover:text-primary overflow-hidden group">
                <img
                  className="group-hover:scale-[1.05] transition duration-300 w-full max-h-52 object-cover"
                  src={item.data.image.src}
                  alt={item.data.title}
                  width={445}
                  height={230}
                />
              </a>
            )}

            <ul className="mt-2 flex flex-wrap items-center justify-center">
              {/*<li className="mr-5 flex items-center flex-wrap">
                <BiUser className="mr-1 h-[18px] w-[18px]" />
                <>
                  <ul>
                    {item.data.authors.map((author: string, i: number) => (
                      <li className="inline-block">
                        <a
                          href={`${import.meta.env.BASE_URL}authors/${slugify(author)}`}
                          className="mr-2 hover:text-primary font-medium"
                        >
                          {humanize(author)}{i !== item.data.authors.length - 1 && ","}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              </li>*/}
              {/*<li className="mr-5 flex items-center flex-wrap font-medium">
                <BiCalendar className="mr-1 h-5 w-5" />
                <>{dateFormat(item.data.date)}</>
              </li>*/}
              <li className="flex items-center flex-wrap font-thin">
                <BiCategoryAlt className="pr-1 h-[18px] w-[18px]" />
                <>
                  <ul>
                    {item.data.categories.map((category: string, i: number) => (
                      <li className="inline-block">
                        <a
                          href={`${import.meta.env.BASE_URL}categories/${slugify(category)}`}
                          className="mr-2 hover:text-primary"
                        >
                          {humanize(category)}{i !== item.data.categories.length - 1 && ","}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              </li>
            </ul>

            <h3 className="mb-1 text-2xl">
              <a href={`${import.meta.env.BASE_URL}${item.slug}`} className="block hover:text-primary transition duration-300">
                {item.data.title}
              </a>
            </h3>
            <p className="mb-4">
            {
              item.data.description ? item.data.description :
              item.content?.slice(0, Number(summary_length)) + "..."
            }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
