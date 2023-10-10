import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
// formula for average calculation in this app
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

// App logo
function NavBar({ movies, query, setQuery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <SearchBar query={query} setQuery={setQuery} />
      <SearchResult movies={movies} />
    </nav>
  );
}

// Logo for App
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
// SearchBar for movie Search
function SearchBar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
// Total Search Result is Catched ...
function SearchResult() {
  return (
    <p className="num-results">
      Found <strong></strong> results
    </p>
  );
}

// The Main Component or Brain of the this web-App...
export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("new");
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const apiKey = "41804e3e";
  useEffect(() => {
    const fetchMovieData = async () => {
      setIsloading(true);
      setError(""); // Clear any previous errors
      const apiKey = "41804e3e";
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}&s=${query}`
        );
        if (!res.ok) {
          throw new Error("Not Fetched!");
        }
        const data = await res.json();
        console.log(data);
        if (data.Response === "False") {
          setError("⛔ Movie not found!");
        } else {
          setMovies(data.Search);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data.");
      } finally {
        setIsloading(false);
      }
    };

    fetchMovieData();
  }, [query]);

  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery} />
      <main className="main">
        <Toggler>
          {isLoading && <Loader />}
          {!isLoading && !error && <SearchedResult movies={movies} />}
          {error && <Error error={error} />}
        </Toggler>
        <Toggler>
          <WatchedResult watched={watched} />
        </Toggler>
      </main>
    </>
  );
}
function Loader() {
  return (
    <div className="loader">
      <p>Loading...</p>
    </div>
  );
}
function Error({ error }) {
  return (
    <div className="loader">
      <p>{error}</p>
    </div>
  );
}
// Given Searched Result is Here's COmponent...
function SearchedResult({ movies }) {
  return (
    <div className="box">
      <ul className="list">
        {movies?.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>🗓</span>
                <span>{movie.Year}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
// Toggling bar for showing part ...
function Toggler({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
//  Movies Watched Result Component ...
function WatchedResult({ watched }) {
  return (
    <div className="box">
      <>
        <Summary watched={watched} />
        <SummaryList watched={watched} />
      </>
    </div>
  );
}

// Summary of all movies ...
function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
// Total list of Watched Movie in This Component...
function SummaryList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
