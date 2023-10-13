import { useEffect, useState } from "react";
import StarRating from "./StarRating.jsx";
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
      <h1>MXC👁️RN</h1>
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
function SearchResult({ movies }) {
  const numResults = Array.isArray(movies) ? movies.length : 0;

  return (
    <p className="num-results">
      Found <strong>{numResults}</strong> results
    </p>
  );
}

// The Main Component or Brain of the this web-App...
export default function App() {
  const [query, setQuery] = useState("Punjab");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const apiKey = "41804e3e";

  function handleMovieDetails(id) {
    setSelectedId((selectedId) => (id === selectedId ? setSelectedId("") : id));
  }
  function handlebackbtn() {
    setSelectedId("");
  }
  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchMovieData = async () => {
      setIsloading(true);
      setError(""); // Clear any previous errors
      const apiKey = "41804e3e";
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}&s=${query}`,
          { signal }
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
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsloading(false);
      }
    };

    fetchMovieData();

    // Abort the fetch request if the component unmounts
    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery} />
      <main className="main">
        <Toggler>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <SearchedResult
              movies={movies}
              handleMovieDetails={handleMovieDetails}
            />
          )}
          {error && <Error error={error} />}
        </Toggler>
        <Toggler>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handlebackbtn={handlebackbtn}
              onWatchMovie={handleWatchedMovie}
              onbackbtn={handlebackbtn}
              watched={watched}
            />
          ) : (
            <WatchedResult
              watched={watched}
              onDeleteWatched={handleDeleteWatched}
            />
          )}
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
function MovieDetails({
  selectedId,
  handlebackbtn,
  onWatchMovie,
  onbackbtn,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const apiKey = "41804e3e";
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const WachedUserRating = watched.find(
    (movie) => movie.imdbID == selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function handleAddmovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onWatchMovie(newWatchedMovie);
    onbackbtn();
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?i=${selectedId}&apikey=${apiKey}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
        // console.log(`Clean up effect for movie ${title}`);
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handlebackbtn}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddmovie}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p style={{ textAlign: "center", fontWeight: "bold" }}>
                  You Already Rated this Movie with{" "}
                  <span>{WachedUserRating}⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
// Given Searched Result is Here's COmponent...
function SearchedResult({ movies, handleMovieDetails }) {
  return (
    <div className="box">
      <ul className="list">
        {movies?.map((movie) => (
          <li
            key={movie.imdbID}
            onClick={() => handleMovieDetails(movie.imdbID)}
          >
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>📅</span>
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
function WatchedResult({ watched, onDeleteWatched }) {
  return (
    <div className="box">
      <>
        <Summary watched={watched} />
        <SummaryList watched={watched} onDeleteWatched={onDeleteWatched} />
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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
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
function SummaryList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.Title} poster`} />
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
            <button
              className="btn-delete"
              onClick={() => onDeleteWatched(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
