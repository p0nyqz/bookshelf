import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// TMDB API KEY
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const SearchMovies = ({
	addFavorite,
	removeFavorite,
	favorites = [],
}) => {
	const [query, setQuery] = useState(""); // Состояние для ввода пользователя
	const [movies, setMovies] = useState([]); // Состояние для результатов поиска
	const [viewMode, setViewMode] = useState<"poster" | "list">("poster"); // Состояние для переключения вида
	const [movieDetails, setMovieDetails] = useState({}); // Состояние для хранения подробной информации о фильмах

	// Функция для поиска фильмов по названию
	const handleSearch = async () => {
		if (query.trim()) {
			try {
				const response = await axios.get(
					`https://api.themoviedb.org/3/search/movie`,
					{
						params: {
							api_key: API_KEY,
							query: query,
						},
					},
				);
				setMovies(response.data.results); // Сохранение фильмов в состоянии
				setMovieDetails({}); // Очистка старых данных
			} catch (error) {
				console.error("Error fetching movie data:", error);
			}
		}
	};

	// Функция для получения подробной информации о фильме
	const fetchMovieDetails = async (movieId) => {
		try {
			const response = await axios.get(
				`https://api.themoviedb.org/3/movie/${movieId}`,
				{
					params: {
						api_key: API_KEY,
					},
				},
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching movie details:", error);
		}
	};

	// Используем useEffect для загрузки подробной информации при переключении на режим списка
	useEffect(() => {
		const loadMovieDetails = async () => {
			if (viewMode === "list") {
				const details = await Promise.all(
					movies.map((movie) => fetchMovieDetails(movie.id)),
				);
				const detailsMap = details.reduce((acc, detail) => {
					acc[detail.id] = detail;
					return acc;
				}, {});
				setMovieDetails(detailsMap); // Сохраняем подробную информацию в состоянии
			}
		};
		loadMovieDetails();
	}, [viewMode, movies]);

	// Функция для проверки, находится ли фильм уже в избранном
	const isFavorite = (movieId) => favorites.some((fav) => fav.id === movieId);

	// Функция для переключения режима отображения
	const toggleViewMode = () => {
		setViewMode((prevMode) => (prevMode === "poster" ? "list" : "poster"));
	};

	return (
		<div className="search-movies">
			<div className="flex justify-center mb-4">
				{/* Поле для ввода названия фильма */}
				<input
					type="text"
					className="border p-2 rounded"
					placeholder="Введите название фильма"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button
					onClick={handleSearch}
					className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
				>
					Поиск
				</button>
			</div>

			{/* Кнопка для переключения вида */}
			<div className="flex justify-center mb-4">
				<button
					className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
					onClick={toggleViewMode}
				>
					{viewMode === "poster"
						? "Переключить на список"
						: "Переключить на постеры"}
				</button>
			</div>

			{/* Отображение фильмов в зависимости от режима (постеры или список) */}
			{viewMode === "poster" ? (
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
								<div className="text-gray-500">Нет постера</div>
							)}
							<h3 className="mt-2 text-lg">{movie.title}</h3>

							{/* Проверка, добавлен ли фильм в избранное */}
							{isFavorite(movie.id) ? (
								<button
									className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
									onClick={() => removeFavorite(movie.id)}
								>
									Удалить из избранного
								</button>
							) : (
								<button
									className="mt-2 bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
									onClick={() => addFavorite(movie)}
								>
									Добавить в избранное
								</button>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col space-y-4">
					{movies.map((movie) => {
						const details = movieDetails[movie.id]; // Получаем детали фильма из состояния

						return (
							<div key={movie.id} className="border p-4 rounded-lg shadow-lg">
								<div className="flex items-center">
									<img
										src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
										alt={movie.title}
										className="w-16 h-24 mr-4"
									/>
									<div>
										<h2 className="text-xl font-semibold">{movie.title}</h2>
										<p>Год выпуска: {movie.release_date.split("-")[0]}</p>
										<p>Режиссер: {details?.director || "Неизвестен"}</p>
										<p>
											Актеры:{" "}
											{details?.cast?.slice(0, 5).join(", ") || "Неизвестны"}
										</p>
									</div>
								</div>

								{/* Проверка, добавлен ли фильм в избранное */}
								{isFavorite(movie.id) ? (
									<button
										className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
										onClick={() => removeFavorite(movie.id)}
									>
										Удалить из избранного
									</button>
								) : (
									<button
										className="mt-2 bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
										onClick={() => addFavorite(movie)}
									>
										Добавить в избранное
									</button>
								)}
							</div>
						);
					})}
				</div>
			)}

			{/* Ссылка на просмотр избранных фильмов */}
			<div className="mt-4 text-center">
				<Link to="/favorites" className="text-blue-500 underline">
					Просмотр избранного
				</Link>
			</div>
		</div>
	);
};
