import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Ваш API ключ из TMDB (замените на реальный ключ)
const API_KEY = "71c3c2eb04ed357995896b0bc9ffcbd7";

export const SearchMovies = ({ addFavorite }) => {
	const [query, setQuery] = useState(""); // Состояние для ввода пользователя
	const [movies, setMovies] = useState([]); // Состояние для результатов поиска

	const handleSearch = async () => {
		if (query.trim()) {
			try {
				// Запрос к TMDB для поиска фильма по названию
				const response = await axios.get(
					`https://api.themoviedb.org/3/search/movie`,
					{
						params: {
							api_key: API_KEY,
							query: query,
						},
					},
				);
				// Устанавливаем фильмы в состояние
				setMovies(response.data.results);
			} catch (error) {
				console.error("Error fetching movie data:", error);
			}
		}
	};

	return (
		<div className="search-movies">
			<div className="flex justify-center mb-4">
				{/* Поле для ввода названия фильма */}
				<input
					type="text"
					className="border p-2 rounded"
					placeholder="Enter movie name"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button
					onClick={handleSearch}
					className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
				>
					Search
				</button>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{movies.map((movie) => (
					<div key={movie.id} className="movie-item text-center">
						{movie.poster_path ? (
							<img
								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								alt={movie.title}
								className="w-full h-auto rounded"
							/>
						) : (
							<div className="text-gray-500">No poster available</div>
						)}
						<h3 className="mt-2 text-lg">{movie.title}</h3>
						<button
							className="mt-2 bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
							onClick={() => addFavorite(movie)}
						>
							Add to Favorites
						</button>
					</div>
				))}
			</div>

			{/* Ссылка на просмотр избранных фильмов */}
			<div className="mt-4 text-center">
				<Link to="/favorites" className="text-blue-500 underline">
					View Favorites
				</Link>
			</div>
		</div>
	);
};
